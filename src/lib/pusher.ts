// import PusherServer from "pusher"
// import PusherClient from "pusher-js"
import Pusher from "pusher"
// import {Pusher } from "pusher-js"
// export const pusherServer = new Pusher({
//     appId:  process.env.PUSHER_APP_ID!,  // exclamation mark tells that value exist always to typescript
//     key:    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
//     secret: process.env.PUSHER_APP_SECRET!,
//     useTLS: true,
//     cluster: 'ap2',
// })
export const pusherServer = new Pusher({
    appId: "1643237",  // exclamation mark tells that value exist always to typescript
    key:    "4a844c976a3ce013a6b9" ,
    secret: "b9b9dfa1e04802a8cfa4",
    useTLS: true,
    cluster: 'ap2',
})

