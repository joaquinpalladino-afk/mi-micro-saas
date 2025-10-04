import {NextResponse} from 'next/server';
import prisma from '@/libs/prisma';
import { createSupabaseClient } from "@/libs/supabase/server";

export async function GET(){
    try {
    const supabase = await createSupabaseClient();
    const session = await supabase.auth.getUser();
    const userId = session.data.user?.id;   

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    const tasks = await prisma.task.findMany({
        where: {
            author: 
            {
                id: userId
            }
        }
    });

    const tags = await prisma.tag.findMany({
        where: {
            author:
            {
                id: userId
            }
        }
    });

const task = tasks.length;
const tag = tags.length;

console.log(user.name, tags.length);
return NextResponse.json({user, tags, tag, tasks, task});
} catch (error) {
    return NextResponse.json(error);
}
}