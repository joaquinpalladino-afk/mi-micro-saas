import {NextResponse} from 'next/server';
import prisma from '@/libs/prisma';
import { createSupabaseClient } from "@/libs/supabase/server";
import { redirect } from 'next/dist/server/api-utils';

export async function GET(request, {params}){
try {
const supabase = await createSupabaseClient();
const session = await supabase.auth.getUser();
const userId = session.data.user?.id;
const { id } = params;

const tasks = await prisma.task.findUnique({
    where: {
        id: parseInt(id),
        author: {
          id: userId
        }
    },
    include: {
        tags: true
    }
});

const tags = tasks.tags;

console.log(tags);
return NextResponse.json({tasks, tags});
} catch (error) {
    return NextResponse.json(error);
}
}

export async function PUT(request, {params}) {
try {
const supabase = await createSupabaseClient();
const session = await supabase.auth.getUser();
const userId = session.data.user?.id;

const {title, descrition, expired, completed, tags, priority, dueDate} = await request.json();

if(!title || !descrition || !expired || !completed || !tags || !priority || !dueDate){
const updatedTask = await prisma.task.update({
    where: {
        id: parseInt(params.id),
        author: {
          id: userId
        }
    },
    data: {
        title,
        descrition,
        completed
    }})
    console.log(updatedTask);
    return NextResponse.json(updatedTask);
}else{
    const updatedTask = await prisma.task.update({
    where: {
        id: parseInt(params.id)
    },
    data: {
        title,
        descrition,
        completed,
        expired,
        tags: { 
            connectOrCreate: {
                where: {userId_name: {userId: userId, name: tags}},
                create: {userId: userId, name: tags}
            }
        },
        priority,
        dueDate
    }
})
console.log(updatedTask);
return NextResponse.json(updatedTask);
}


} catch (error) {
    console.log(error);
    return NextResponse.json(error);
}
}

export async function DELETE(request, {params}){
try {
const supabase = await createSupabaseClient();
const session = await supabase.auth.getUser();
const userId = session.data.user?.id;

const id = params.id;
await prisma.task.delete({
    where: {
        id: parseInt(id),
        author: {
          id: userId
        }
    }
})
redirect('/');
return NextResponse.json({message: 'Task deleted'});
} catch (error) {
    return NextResponse.json(error);
}
}