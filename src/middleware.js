import { updateSession, getUser } from "./libs/supabase/middleware"
import { NextResponse } from "next/server";

export async function middleware(request, response) {
    const publicUrls = ["/auth/reset/password"];

    if(publicUrls.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }
    
    const protectedRoutesList = ["/", "/tasks", "/new", "/profile"],
     authRoutesList = ["/auth/login", "/auth/signup", "/auth/reset", "/auth/confirm-email"];
    const currentPath = new URL(request.url).pathname;
    try{
    const {
        data: { user },
    } = await getUser(request, response);

    if(protectedRoutesList.includes(currentPath) && !user) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if(authRoutesList.includes(currentPath) && user) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    await updateSession(request);
} catch(error) {
    console.log(error);
}
}

export const config = {
    matcher: [
          "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ]
}