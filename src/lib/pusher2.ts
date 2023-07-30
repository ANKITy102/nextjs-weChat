import Pusher from "pusher-js"
// export const pusherClient = new Pusher(
//     process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
//     {
//         cluster: "ap2",    
//     }  
// )
export const pusherClient =   new Pusher(
    "4a844c976a3ce013a6b9",
    {
        cluster: "ap2",    
    }
    
    )