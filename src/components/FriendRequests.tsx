"use client"
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[]
  sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({incomingFriendRequests, sessionId}) => {
    const [friendRequests, setincomingFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests);
    const router = useRouter();
    const acceptFriend = async (senderId: string) =>{
        await axios.post('/api/friends/accept', {id: senderId});

        setincomingFriendRequests((prev)=> prev.filter((request) => request.senderId !== senderId))
        console.log("here is refresh code")
        // router.refresh();
        window.location.reload();
    }
    const denyFriend = async (senderId: string)=>{
        await axios.post('/api/friends/deny', {id: senderId})
        setincomingFriendRequests((prev)=> prev.filter((request) => request.senderId !== senderId))
        console.log("here is refresh code")
                      window.location.reload();
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