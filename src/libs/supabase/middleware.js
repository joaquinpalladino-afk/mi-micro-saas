import { createServerClient } from "@supabase/ssr";
import {NextResponse} from 'next/server';

export async function updateSession(request) {
let supabaseResponse = await NextResponse.next({
    request,
});

const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
        cookies: {
           getAll() {
            return request.cookies.getAll();
           },
           setAll(cookiesToSet) {
            try {
                cookiesToSet.forEach(({name, value}) => {
                 request.cookies.set({name, value});
                });

                supabaseResponse = NextResponse.next({
                    request,
                });

                cookiesToSet.forEach(({name, value, options}) => {
                 supabaseResponse.cookies.set({name, value, options});
                });
            } catch (error) {
                console.error(error);
            }
           }
        }
    }
    );

    await supabase.auth.getUser();

    return supabaseResponse;
}

export async function getUser(request, response) {

const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
        cookies: {
           getAll() {
            return request.cookies.getAll();
           },
           setAll(cookiesToSet) {
            try {
                cookiesToSet.forEach(({name, value}) => {
                 request.cookies.set({name, value});
                });

                response = NextResponse.next({
                    request,
                });

                cookiesToSet.forEach(({name, value, options}) => {
                 response.cookies.set({name, value, options});
                });
            } catch (error) {
                console.error(error);
            }
           }
        }
    }
    );

    return supabase.auth.getUser();
}