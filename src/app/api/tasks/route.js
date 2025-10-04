import {NextResponse} from 'next/server';
import prisma from '@/libs/prisma';
import { createSupabaseClient } from "@/libs/supabase/server";

export async function POST(request){
try {
const supabase = await createSupabaseClient();
const session = await supabase.auth.getUser();
const userId = session.data.user?.id;

const {title, descrition, tags, dueDate, priority} = await request.json();
const newTask = await prisma.task.create({
    data: {
      title,
      descrition,
      dueDate,
      priority,
      tags: {
        connectOrCreate: {
          where: {userId_name: {userId: userId, name: tags}},
          create: {userId: userId, name: tags}
        }
      },
      author: {
        connect: {
          id: userId
        }
      }
    }
})

return NextResponse.json(newTask);
} catch (error) {
    return NextResponse.json(error);
}

}

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
        author: {
            id: userId
        }
    },
    include: {
        tags: true
    }
});

const tags = await prisma.tag.findMany({
    where: {
        author: {
            id: userId
        }
    }
});

console.log(tasks);
return NextResponse.json({tasks, user, tags});
} catch (error) {
    return NextResponse.json(error);
}
}