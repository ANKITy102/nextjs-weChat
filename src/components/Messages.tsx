"use client"
import { cn } from '@/lib/utils';
import { Message } from '@/lib/validations/message';
import { FC, useRef, useState } from 'react'
import { format } from 'date-fns'
import Image from 'next/image';
import { User } from 'next-auth';
interface MessagesProps {
  intialMessages: Message[] | undefined
  sessionId: string
  sessionImg: string | null | undefined
  chatPartner: User
}

const Messages: FC<MessagesProps> = ({intialMessages, sessionId, sessionImg, chatPartner}) => {
    const [messages, setMessages] = useState<Message[] | undefined>(intialMessages);
    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    const formatTimeStamp = (timeStamp: number)=>{
        return format(timeStamp, "HH:mm")
    }
  return <div id="messages" className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-rounded scrollbar-thumb-blue  scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
    <div ref={scrollDownRef}></div>
    {
        messages?.map((message, index)=>{
            const isCurrentUser = message.senderId === sessionId;
            const hasNextMessageFromSameUser = messages[index-1]?.senderId===messages[index].senderId;


            return (
            <div key={`${message.id}-${message.timestamp}`} className="chat-message">
                <div className={cn('flex items-end',{
                    'justify-end': isCurrentUser
                })}>
                    <div className={cn("flex flex-col space-y-2 text-base max-w-xs mx-2",{
                        "order-1 items-end": isCurrentUser,
                        "order-2 items-start": !isCurrentUser,
                    })}>
                        <span className={cn('px-4 py-2 rounded-lg inline-block',{
                            "bg-indigo-600 text-white": isCurrentUser,
                            "bg-gray-200 text-gray-900": !isCurrentUser,
                            "rounded-br-none": !hasNextMessageFromSameUser && isCurrentUser,
                            "rounded-bl-none": !hasNextMessageFromSameUser && !isCurrentUser
                        })}>
                            {message.text}{' '}
                            <span className="ml-2 text-xs text-gray-400">
                                {formatTimeStamp(message.timestamp)}
                            </span>
                        </span>
                    </div>
                    <div className={cn('relative w-6 h-6',{
                        'order-2': isCurrentUser,
                        'order-1': !isCurrentUser,
                        'invisible': hasNextMessageFromSameUser
                    })}>
                        <Image
                            fill
                            src={isCurrentUser? (sessionImg as string): chatPartner.image as string}
                            alt="Profile Picture"
                            referrerPolicy="no-referrer"
                            className="rounded-full"
                        />
                    </div>
                </div>
            </div>
            )
        })
    }
</div>
}

export default Messages