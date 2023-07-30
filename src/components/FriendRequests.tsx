"use client"
import { pusherClient } from '@/lib/pusher2';
// import { pusherClient } from '@/lib/pusher2';
// import { pusherClient } from '@/lib/pusher2';
import { toPusherKey } from '@/lib/utils';
// import { pusherClient } from '@/lib/pusher'
// import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Pusher from 'pusher-js';
// importScripts('https://js.pusher.com/7.0/pusher.worker.min.js');    
// import Pusher from 'pusher-js/types/src/core/pusher'
// import Pusher from 'pusher'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[]
  sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({incomingFriendRequests, sessionId}) => {
    const [friendRequests, setincomingFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests);
    const router = useRouter();
    // const pusherFunc = async()=>{
    //     console.log("hil");
    //   
    //         console.log("hil2");
    //       var channel = await pusher.subscribe('my-channel');
    //       channel.bind('my-event', function(data:{message:string}) {
    //         console.log("hi message here")
    //         alert(JSON.stringify(data));

    //       });
    // }
    useEffect(()=>{
            const friendRequestHandler  =async (data: IncomingFriendRequest) =>{
                // console.log("hi live message")
                console.log(data);
                const {senderEmail ,senderId} = data;
                setincomingFriendRequests((prev)=> [...prev, {senderId, senderEmail}])
            }
        
            console.log(sessionId);
           var channel = pusherClient.subscribe(`User_${sessionId}_incoming_friend_requests`);
           channel.bind("incoming_friend_requests", friendRequestHandler);
        return ()=>{
            pusherClient.unsubscribe(`User_${sessionId}_incoming_friend_requests`);
        }
    },[sessionId])
    
    const acceptFriend  = async (senderId: string) =>{
        await axios.post('/api/friends/accept', {id: senderId});
        setincomingFriendRequests((prev)=> prev.filter((request) => request.senderId !== senderId))
        console.log("here is refresh code")
        // window.location.reload();
    }
    const denyFriend = async (senderId: string)=>{
        await axios.post('/api/friends/deny', {id: senderId})
        setincomingFriendRequests((prev)=> prev.filter((request) => request.senderId !== senderId))
        console.log("here is refresh code")
                    //   window.location.reload();
    }
  return <>
    {friendRequests.length===0 ?(
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
    ):(
        friendRequests.map((request)=>{
            console.log(request)
            return <div key={request.senderId} className='flex gap-4 items-center'>
                <UserPlus className="text-black"/>
                <p className="font-medium text-lg">{request.senderEmail}</p>
                <button onClick={()=>acceptFriend(request.senderId)} aria-label="accept friend" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md">
                    <Check className="font-semibold text-white w-3/4 h-3/4"/>
                </button>

                <button onClick={()=>denyFriend(request.senderId)} aria-label="deny friend" className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md">
                    <X className="font-semibold text-white w-3/4 h-3/4"/>
                </button>
            </div>
        })
    )}
  </>
}

export default FriendRequests