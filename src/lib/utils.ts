import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]){ //cn-> className
    return twMerge(clsx(inputs))
}  

export function chatHrefConstructor (id1: string, id2: string){
    const sortedIds = [id1,id2].sort();
    return `${sortedIds[0]}--${sortedIds[1]}`
}

// pusher don't know the colon so we replace all the : to __ which is known by pusher
export function toPusherKey(key: string){
    return key.replace(/:/g, '__');
}