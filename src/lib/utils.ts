import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]){ //cn-> className
    return twMerge(clsx(inputs))
}  