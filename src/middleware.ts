import { getToken } from 'next-auth/jwt';
import {withAuth} from 'next-auth/middleware'
import { NextResponse } from 'next/server';

export default withAuth(
    async function middleware(req){
        const pathname = req.nextUrl.pathname;

        //Manage route protection
        const isAuth = await getToken({req});
        const isLoginPage = pathname.includes("/login")
        const sensitiveRoutes = ['/dashboard'];
        const isAccessingSensitiveRoute = sensitiveRoutes.some((route)=> pathname.startsWith(route));
     
        //user trying to access login page
        if(isLoginPage){
            // if logged in redirect to dashboard
            if(isAuth){

                return NextResponse.redirect(new URL("/dashboard", req.url));
                // /dashboard will be append to req.url = http://localhost:3000
            }
            return NextResponse.next();
            // this is that if user is not logged in then return from here and let user to go to login page
        }
        
        // if user accessing sensitve route then check authentication
        if(!isAuth && isAccessingSensitiveRoute){
            return NextResponse.redirect(new URL("/login", req.url));
        }

        //this is just that as we don't have any thing on home page on /url
        if(pathname==='/'){
            return NextResponse.redirect(new URL("/dashboard",req.url));
        }
    },
    {
        callbacks:{
            async authorized(){
                return true;
            }
        }
    }
)
export const config = {
    matcher: ['/', '/login', '/dashboard/:path']
}