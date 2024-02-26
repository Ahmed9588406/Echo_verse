import mongoose from "mongoose";
/*
Defines a Mongoose schema for a post, including fields for text content, author, community, creation timestamp, parent ID, and an array of child posts.
The schema is then used to create a Mongoose model, which can be used to interact with a MongoDB collection named 'posts'
*/

// Mongoose schema for the Post model is created using mongoose.Schema.
// This schema defines the structure of the documents that will be stored in the corresponding MongoDB collection.
const postSchema = new mongoose.Schema({
    text: {type: String, required:true}, // This field represents the main text content of the post. It is of type String and is required.

    /*
    The author of the post. It is of type mongoose.Schema.Types.ObjectId,
    which is an identifier that refers to another document in the 'User' collection. The ref option specifies the referenced model. It is marked as required,
    meaning every post must have an author.
    */
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },

    /*
    This field represents the community to which the post belongs.
    It is of type mongoose.Schema.Types.ObjectId and refers to documents in the 'Community' collection.
    It is optional as indicated by the absence of the required option.
    */

    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    /*
    This field represents the creation timestamp of the post. It is of type Date,
    it defaults to the current date and time    
    */
    createdAt: {
        type: Date,
        default: Date.now
    },

    // This field represents the ID of the parent post if this post is a reply or comment. It is of type String
    parentId: {
        type: String
    },
    // Array of child posts, where each element is a reference to another post using its ObjectId
    children: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
]

});
// the Mongoose model for the Post schema. It checks if the model already exists to prevent redefinition and then creates it if not
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;


// Explain 

/**
 * Post Original
 *   -> Post Comment1
 *   -> Post Comment2
 *      ->Post Comment3
 * 
 */