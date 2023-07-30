'use client'
import { pusherClient } from '@/lib/pusher2'
import { User } from 'lucide-react'
import Link from 'next/link'
// import Pusher from 'pusher-js'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsSidebarOptionProps {
    sessionId: string,
  initialUnseenRequestCount:number
}

const FriendRequestsSidebarOption: FC<FriendRequestsSidebarOptionProps> = ({sessionId, initialUnseenRequestCount}) => {
    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
        initialUnseenRequestCount
    )
    // console.log(unseenRequestCount)
    useEffect(()=>{
      const friendRequestHandler  =async () =>{
        setUnseenRequestCount((prev)=> prev+1);
    }
 
   var channel = pusherClient.subscribe(`User_${sessionId}_incoming_friend_requests`);
   channel.bind("incoming_friend_requests", friendRequestHandler);
return ()=>{
    pusherClient.unsubscribe(`User_${sessionId}_incoming_friend_requests`);
}
    },[])
  return <Link className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold" href="/dashboard/requests">
    <div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <User className="h-4 w-4"/>
    </div>
    <p className="truncate">Friend Requests</p>
    {unseenRequestCount > 0 ? (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
            {unseenRequestCount}
        </div>
    ) : (null)}
  </Link>
}

export default FriendRequestsSidebarOption