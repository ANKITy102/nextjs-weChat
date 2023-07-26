import FriendRequests from '@/components/FriendRequests'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'



const page = async() => {
    const session =await getServerSession(authOptions)
    if(!session) notFound();


    //ids of people who sent current logged in user a friend requests
    const incomingSenderIds = await fetchRedis("smembers", `user:${session.user.id}:incoming_friend_requests`) as string[];
    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async(senderId)=>{
            const sender = await fetchRedis('get', `user:${senderId}`) as string;
            // console.log(senderId);
            // const dta =await sender.json();
            // const email = "email";
            // console.log(sender[email])
            const resultdata  = JSON.parse(sender) as User
            // console.log(resultdata)
            // console.log(resultdata.email)
            return {
                senderId,
                senderEmail: resultdata.email
            }
        })
    )
    // console.log("------------")
    // console.log(incomingFriendRequests);
  return<main className="pt-8">
  <h1 className="font-bold text-5xl mb-8">
      Add a friend
  </h1>
  <div className="flex flex-col gap-4">
    <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
  </div>
</main>
}

export default page