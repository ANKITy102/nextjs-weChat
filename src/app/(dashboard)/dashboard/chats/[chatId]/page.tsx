import ChatInput from "@/components/ChatInput";
import Messagesc from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { Messages, User } from "@/types/dbss";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessages = results.map(
      (message) => JSON.parse(message) as Messages
    );
    const reversedMessages = dbMessages.reverse();
    const messages = messageArrayValidator.parse(reversedMessages) ;
    return messages ;
  } catch (error) {
      
  }
}

const page = async ({ params }: pageProps) => {
  // await new Promise((resolve)=> setTimeout(resolve, 5000));
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const { user } = session;
  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }
  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;
  const initialMessages = await getChatMessages(chatId) as Messages[] | [];
  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
              <span className="text-sm text-gray-600">
                {chatPartner.email}
              </span>
          </div>
        </div>
      </div>
      <Messagesc chatId={chatId} chatPartner={chatPartner} sessionImg={session.user.image}  intialMessages={initialMessages} sessionId={session.user.id}/>
      <ChatInput chatId={chatId} chatPartner={chatPartner}/>
    </div>
  );
};

export default page;
