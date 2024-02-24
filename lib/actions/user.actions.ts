"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Post from "../models/post.model";
import { FilterQuery, SortOrder } from "mongoose";


const QUERY_TIMEOUT = 30000; 
interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
  }
export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
} : Params): Promise<void> {
    connectToDB()

    try {
       const updatedUser =  await User.findOneAndUpdate(
            {id: userId},
            {
                username:username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            {upsert: true,
             new: true,
             timeout:QUERY_TIMEOUT,
             retryWrites: true  
            } // a database operation that will update an existing row if a specified value already exists in a table, and insert a new row if the specified value doesn't already exist
        )

        if (!updatedUser) {
            // Handle case where user not found or update failed
            throw new Error("Failed to create/update user");
          }
    
        if(path === '/profile/edit'){
            revalidatePath(path)
        }
        
    } catch (error: any) {
        console.error("Error updating user:", error);

        throw new Error(`Failed to create/update user ${error.message}`)
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB()

        return await User
        .findOne({id:userId})
        /* To know which commubity this user belongs to
        .populate({
            path: 'communities',
            model: Community
        })
        */
    } catch (error:any) {
        alert(`Failed to fetch user: ${error.message}`)
    }
}


export async function fetchUserPosts(userId:string) {
    try {
        connectToDB()

        // Find all Posts authored by user with the given userId

        // TODO: Populate community
        const posts = await User.findOne({id: userId})
            .populate({
                path: 'posts',
                model: Post,
                populate: {
                    path: 'children',
                    model:Post,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            })

            return posts
    } catch (error: any) {
        alert(`Failed to fetch user posts: ${error.messsage}`)
    }
}


export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
} : {
    userId: string
    searchString?: string
    pageNumber?: number
    pageSize?:number
    sortBy?:SortOrder
}) {
    try {
        connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize

        const regex = new RegExp(searchString, "i")

        const query: FilterQuery<typeof User> = {
            id:{$ne: userId}
        }
        
        if(searchString.trim() !== ''){
            query.$or =[
                {username: {$regex: regex}},
                {name: {$regex: regex}}
            ]
        }

        const sortOptions = {createdAt: sortBy}

        const usersQuery = User.find(query)
          .sort(sortOptions)
          .skip(skipAmount)
          .limit(pageSize)

        const totalUsersCount = await User.countDocuments(query) 
        const users = await usersQuery.exec()

        const isNext = totalUsersCount > skipAmount + users.length

        return {users, isNext}
        
    } catch (error: any) {
        alert(`Failed To fetch users: ${error.message} `)
    }
}

export async function getActivity(userId:string) {
    try {
        connectToDB()
        // find all posts created by the user
        const userPosts = await Post.find({author: userId})

        // Collect all the child posts ids (replies) from the children field
        // we want here to keep track all the childrens (comments)
        // takes an array of posts and take a child props
        const childPostIds = userPosts.reduce((acc, userPost) => {
            return acc.concat(userPost.children)
        }, []) // for the error cause in the running he didn't know concat is a function

        const replies = await Post.find({
            _id: {$in: childPostIds},
            author: {$ne: userId}
        }).populate({
            path:'author',
            model:User,
            select: 'name image _id'
        })

        return replies
    } catch (error:any) {
        alert(`Failed to fetch activity: ${error.message}`)
    }
}
// explaination
/*
const userPosts = [
    {
        id:1,
        children:['This is great', 'this is bad', 'This is terrible']
    },

    {
        id:2,
        children:['os', 'bad']
    },

     go in each one of this and make them in one array

     ['This is great', 'this is bad', 'This is terrible', 'ok', 'bad']
]
*/