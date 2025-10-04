'use client'

import { BEdit, BDelete } from '@/components/Buttons';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen bg-slate-900 text-white">
        <p className="text-xl">Cargando tarea...</p>
    </div>
);

const priorityStyles = {
  ALTA: 'bg-red-500',
  MEDIA: 'bg-yellow-500',
  BAJA: 'bg-green-500',
};

export default function TaskPage() {
    const [task, setTask] = useState(null);
    const [tag, setTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

  const handleDelete = (taskId) => {
    console.log('Deleting task with ID:', taskId)
  };

    useEffect(() => {
        const getTask = async () => {
            try {
                const response = await fetch(`/api/tasks/${id}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || "No se pudo encontrar la tarea.");
                }
                const data = await response.json();
                setTask(data.tasks);
                setTag(data.tags[0]);
                setEditedTitle(data.tasks.title);
                setEditedDescription(data.tasks.descrition || '');
            } catch (error) {
                console.error("Error fetching task:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getTask();
        }
    }, [id]);

console.log(tag);
console.log(task);

    const updateTask = async (field, value) => {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value, completed: task.completed }),
            });

            if (!response.ok) {
                console.error('Failed to update task');
                // Revert optimistic update
                if (field === 'title') {
                    setTask(prev => ({ ...prev, title: task.title }));
                } else if (field === 'descrition') {
                    setTask(prev => ({ ...prev, descrition: task.descrition }));
                }
            }
        } catch (error) {
            console.error('Error updating task:', error);
            // Revert optimistic update
            if (field === 'title') {
                setTask(prev => ({ ...prev, title: task.title }));
            } else if (field === 'descrition') {
                setTask(prev => ({ ...prev, descrition: task.descrition }));
            }
        }
    };

    const handleTitleDoubleClick = () => {
        setIsEditingTitle(true);
    };

    const handleDescriptionDoubleClick = () => {
        setIsEditingDescription(true);
    };

    const handleTitleChange = (e) => {
        setEditedTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setEditedDescription(e.target.value);
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setTask(prev => ({ ...prev, title: editedTitle }));
            setIsEditingTitle(false);
            updateTask('title', editedTitle);
        } else if (e.key === 'Escape') {
            setIsEditingTitle(false);
            setEditedTitle(task.title);
        }
    };

    const handleDescriptionKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setTask(prev => ({ ...prev, descrition: editedDescription }));
            setIsEditingDescription(false);
            updateTask('descrition', editedDescription);
        } else if (e.key === 'Escape') {
            setIsEditingDescription(false);
            setEditedDescription(task.descrition || '');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || !task) {
        return (
            <main className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-8 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">{error ? "Error" : "Tarea no encontrada"}</h1>
                    <p className="text-slate-400 mb-8">{error || "La tarea que estás buscando no existe o fue eliminada."}</p>
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
                <header className="mb-10">
                    <button
                        onClick={() => router.push('/')}
                        className="text-sky-500 hover:text-sky-400 transition-colors mb-4"
                    >
                        &larr; Volver a Tareas
                    </button>
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={handleTitleChange}
                            onKeyDown={handleTitleKeyDown}
                            onBlur={() => {
                                setIsEditingTitle(false);
                                setEditedTitle(task.title);
                            }}
                            className="text-3xl sm:text-4xl font-bold bg-slate-800 border-b-2 border-sky-500 outline-none w-full"
                            autoFocus
                        />
                    ) : (
                        <h1 onDoubleClick={handleTitleDoubleClick} className="text-3xl sm:text-4xl font-bold border-b-2 border-slate-700 pb-4">{task.title}</h1>
                    )}
                </header>

                <div className="bg-slate-800 p-6 sm:p-8 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
                    {isEditingDescription ? (
                        <textarea
                            value={editedDescription}
                            onChange={handleDescriptionChange}
                            onKeyDown={handleDescriptionKeyDown}
                            onBlur={() => {
                                setIsEditingDescription(false);
                                setEditedDescription(task.descrition || '');
                            }}
                            className="text-slate-300 bg-slate-700 w-full p-2 rounded-md outline-none"
                            rows="4"
                            autoFocus
                        />
                    ) : (
                        <p onDoubleClick={handleDescriptionDoubleClick} className="text-slate-300 whitespace-pre-wrap min-h-[4rem]">
                            {task.descrition || 'No hay descripción para esta tarea.'}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-slate-400">Prioridad</h3>
                        <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-full ${priorityStyles[task.priority] || 'bg-gray-400'}`}></span>
                            <p className="text-slate-300">{task.priority || 'No definida'}</p>
                        </div>
                    </div>
                    { !task.expired ? 
                    <div className="bg-slate-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-slate-400">Fecha de Vencimiento</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🗓️</span>
                            <p className="text-slate-300">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No definida'}</p>
                        </div>
                    </div>
                       :
                    <div className="bg-slate-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-red-500">Tarea vencida</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🗓️</span>
                            <p className="text-red-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No definida'}</p>
                        </div>
                    </div>
                       }
                    <div className="bg-slate-800 p-6 rounded-lg md:col-span-2">
                        <h3 className="text-lg font-semibold mb-2 text-slate-400">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {tag && tag.name ? (
                                    <span key={tag.id} className="px-3 py-1 bg-slate-700 rounded-full text-sm">
                                        {tag.name}
                                    </span>
                            ) : (
                                <p className="text-slate-500">No hay tags para esta tarea.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <BEdit id={task.id} />
                    <BDelete id={task.id} setIsDelete={handleDelete} />
                </div>
            </div>
        </main>
    )
}