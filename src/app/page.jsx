import { Suspense } from 'react';
import { createSupabaseClient } from '@/libs/supabase/server';
import  prisma  from '@/libs/prisma';
import TasksManager from '@/components/TasksManager';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

async function getTasks() {
  const supabase = await createSupabaseClient();
  const { data: { user: sessionUser } } = await supabase.auth.getUser();
  const userId = sessionUser?.id;

  if (!userId) {
    // This case should ideally be handled by middleware redirecting to login
    return { tasks: [], user: null, allTags: [], error: 'Not authenticated' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const tasks = await prisma.task.findMany({
      where: { authorId: userId },
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
    });

    const allTags = await prisma.tag.findMany({
      where: { authorId: userId },
    });

    return { tasks, user, allTags };
  } catch (dbError) {
    console.error("Database error:", dbError);
    return { tasks: [], user: null, allTags: [], error: 'Failed to load data from the database.' };
  }
}

export default async function HomePage() {
  const { tasks, user, allTags, error } = await getTasks();

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => router.refresh()} />;
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<LoadingSpinner />}>
        <TasksManager initialTasks={tasks} user={user} allTags={allTags} />
      </Suspense>
    </main>
  );
}