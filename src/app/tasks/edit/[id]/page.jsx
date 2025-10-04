'use client'

import TaskForm from '@/components/TaskForm';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { set } from 'zod';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen bg-slate-900 text-white">
        <p className="text-xl">Cargando tarea para editar...</p>
    </div>
);

export default function EditTaskPage() {
    const [task, setTask] = useState(null);
    const [tag, setTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    useEffect(() => {
        const getTask = async () => {
            try {
                const response = await fetch(`/api/tasks/${id}`);
                if (!response.ok) {
                    throw new Error('Task not found');
                }
                const taskData = await response.json();
                setTask(taskData.tasks);
                setTag(taskData.tags[0]);
            } catch (error) {
                console.error("Error fetching task:", error);
                setTask(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getTask();
        }
    }, [id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!task) {
        return (
            <main className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-8 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Tarea no encontrada</h1>
                    <p className="text-slate-400 mb-8">La tarea que intentas editar no existe o fue eliminada.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2 rounded-md bg-sky-600 hover:bg-sky-500 transition-colors font-semibold"
                    >
                        Volver al inicio
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-8">
            <div className="container mx-auto max-w-2xl">
                <header className="mb-6 sm:mb-10 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold">Editar Tarea</h1>
                </header>
                <TaskForm task={task} tag={tag} />
            </div>
        </main>
    );
}