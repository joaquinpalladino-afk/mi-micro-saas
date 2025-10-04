import { createServerClient } from "@supabase/ssr";
import {cookies} from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function createSupabaseClient() {
    const cookiesStore = await cookies();

    return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
        cookies: {
           getAll() {
            return cookiesStore.getAll();
           },
           setAll(cookiesToSet) {
            try {
                cookiesToSet.forEach(({name, value, options}) => {
                    cookiesStore.set({name, value, options});
                });
            } catch (error) {
                console.error(error);
            }
           }
        }
    }
    );

}

export async function createSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
    );
}