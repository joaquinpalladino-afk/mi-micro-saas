import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';
import { createSupabaseClient } from "@/libs/supabase/server";

export async function GET(){
try {    
const supabase = await createSupabaseClient();
const session = await supabase.auth.getUser();
const userId = session.data.user?.id;

const tags = await prisma.tag.findMany({
    where: {
        author: {
            id: userId
        }
    }
});

console.log(tags);
return NextResponse.json(tags);
} catch (error) {
    return NextResponse.json(error);
}

}