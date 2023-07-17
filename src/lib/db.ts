import {Redis} from '@upstash/redis';
const url= process.env.UPSTASH_REDIS_REST_URL;
const token=  process.env.UPSTASH_REDIS_REST_TOKEN
export const db = new Redis({
    url,
    token
})