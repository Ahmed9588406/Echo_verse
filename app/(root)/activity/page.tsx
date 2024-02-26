import { fetchUser, getActivity} from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"


async function Page() {
    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) redirect('/onboarding')

    // Getting the activity
    const activity = await getActivity(userInfo._id)
    
    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <section className="mt-10 flex flex-col gap-5">
                {activity && activity.length > 0 ? (
                    <>
                    {activity?.map((activity) =>(
                        <Link key={activity._id} href={`/post/${activity.parentId}`}>
                            <article className="activity-card">
                                <div className="relative overflow-hidden rounded-full"
                                style={{ width: '20px', height: '20px' }}
                                >
                                <Image
                                  src={activity.author.image}
                                  alt="Profile Picture"
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-full"
                                  draggable={false}
                                />
                                </div>
                                <p className="!text-small-regular text-light-1">
                                    <span className="mr-1 text-primary-500">
                                        {activity.author.name}
                                    </span>{" "}
                                    replied to your post
                                </p>
                            </article>
                        
                        </Link>
                    ))}
                    </>
                ): <p className="!text-base-regular text-light-3">No activity yet</p>}
            </section>
        </section>

        
    )
}

export default Page