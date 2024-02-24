import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import { profileTabs } from "@/constatnts"
import Image from "next/image"
import PostsTab from "@/components/shared/PostsTab"
// restructure the params as sometimes we don't want the current logged in user we want another one so we did prams
async function Page({params} : {params: {id:string}}) {
    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUser(params.id)

    if(!userInfo?.onboarded) redirect('/onboarding')
    return(
        <section>
            <ProfileHeader
            /* for the user we are looking at */
            accountId={userInfo.id}
            /* // if the current logged in user is the one looking at there own profile*/
            authUserId={user.id} 
            /* or looking for someone else*/
            name={userInfo.name}
            username={userInfo.username}
            imgUrl={userInfo.image}
            bio={userInfo.bio}
            />
            <div className="mt-9">
                <Tabs defaultValue="posts" className="w-full">
                   <TabsList className="tab">
                        {profileTabs.map((tab) => (
                           <TabsTrigger key={tab.label} value={tab.value} className="tab">
                            <Image
                            src={tab.icon}
                            alt={tab.label}
                            width={24}
                            height={24}
                            className="object-contain"
                            />
                             <p className="max-sm:hidden">{tab.label}</p>
                             {tab.label === 'Posts' && (
                                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                    {userInfo?.posts?.length}
                                </p>
                             )}   
                           </TabsTrigger> 
                        ))}
                   </TabsList>
                   {profileTabs.map((tab) => (
                    <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
                        <PostsTab
                          currentUserId={user.id}
                          accountId={userInfo.id}
                          accountType="User"
                        />
                    </TabsContent>
                   ))}
                </Tabs>
            </div>
        </section>
    )
}

export default Page;