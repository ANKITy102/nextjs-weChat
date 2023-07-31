"use client";
import { pusherClient } from "@/lib/pusher2";
import { chatHrefConstructor } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import { User } from "@/types/dbss";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";

interface SidebarChatListProps {
  friends: User[]
  sessionId: string
}
interface ExtendedMessage extends Message{
  senderImg: string,
  senderName: string
}
const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
useEffect(()=>{
    const chatHandler  =async (message: ExtendedMessage) =>{
      const shouldNotify = pathname !== `/dashboard/chats/${chatHrefConstructor(sessionId, message.senderId)}`
      if(!shouldNotify) return;
      toast.custom((t)=>
        // custom component
        <UnseenChatToast 
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      )
      setUnseenMessages((prev)=> [...prev, message]);
    }
    const friendHandler  =async (data: IncomingFriendRequest) =>{
      window.location.reload()
    }
   var channel = pusherClient.subscribe(`User_${sessionId}_chatsNoti`);
   var channel2 = pusherClient.subscribe(`User_${sessionId}_friendsNoti`);
   channel.bind("chat_notifications", chatHandler);
   channel2.bind("friend_notifications", friendHandler);

return ()=>{
   pusherClient.unsubscribe(`User_${sessionId}_chatsNoti`);
   pusherClient.unsubscribe(`User_${sessionId}_friendsNoti`);
  //  channel.ubind("chat_notifications", chatHandler);
  //  channel2.bind("friend_notifications", friendHandler);
  }
},[sessionId, pathname]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend) => {
        const unseenMessageCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;
        return <li key={friend.id}>
            <a href={`/dashboard/chats/${
                chatHrefConstructor(
                    sessionId,
                    friend.id
                )
            }`}
            className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6"
            >{friend.name}
            {unseenMessageCount>0? <div className=" bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">{unseenMessageCount}</div>:(null)}
            </a>
        </li>
      })}
    </ul>
  );
};

export default SidebarChatList;
