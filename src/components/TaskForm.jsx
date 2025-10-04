'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function TaskForm({ task, tag }) {
    const router = useRouter();

    const [title, setTitle] = useState(task?.title || '');
    const [descrition, setDescrition] = useState(task?.descrition || '');
    const [tags, setTags] = useState(tag?.name || '');
    const [priority, setPriority] = useState(task?.priority || 'MEDIA');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [fullDueDate, setFullDueDate] = useState(task?.dueDate || null);
    const [oTags, setOTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadTags = async () => {
            try {
                const response = await fetch(`/api/tags`);
                const data = await response.json();
                setOTags(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadTags();

        if (task?.dueDate) {
            const taskDueDate = new Date(task.dueDate);
            setDueDate(taskDueDate.toISOString().split('T')[0]);
            setDueTime(taskDueDate.toTimeString().slice(0, 5));
        }
    }, [task]);

    useEffect(() => {
        if (dueDate && dueTime) {
            const combinedDateTime = new Date(`${dueDate}T${dueTime}`);
            setFullDueDate(combinedDateTime.toISOString());
        } else if (dueDate) {
            const combinedDateTime = new Date(dueDate);
            setFullDueDate(combinedDateTime.toISOString());
        }
        else {
            setFullDueDate(null);
        }
    }, [dueDate, dueTime]);

    async function onSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        const promise = () => new Promise(async (resolve, reject) => {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    descrition,
                    tags,
                    priority,
                    dueDate: fullDueDate
                })
            })

            if (response.ok) {
                resolve(response);
            } else {
                const errorData = await response.json().catch(() => null);
                reject(errorData?.message || 'Error al editar la tarea');
            }
        });

        toast.promise(promise(), {
            loading: 'Guardando cambios...',
            success: () => {
                router.push(`/tasks/${task.id}`);
                router.refresh();
                return "Tarea actualizada con éxito!";
            },
            error: (err) => err,
            finally: () => setIsSubmitting(false)
        });
    }

    return (
        <form onSubmit={onSubmit} className="bg-slate-800 p-6 sm:p-8 rounded-lg shadow-lg">
            <div className="mb-6">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-slate-400">Título</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Estudiar para el examen"
                    className="w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200"
                    required
                />
            </div>

            <div className="mb-8">
                <label htmlFor="descrition" className="block mb-2 text-sm font-medium text-slate-400">Descripción</label>
                <textarea
                    id="descrition"
                    value={descrition}
                    onChange={(e) => setDescrition(e.target.value)}
                    placeholder="Detalles de la tarea..."
                    rows="5"
                    className="w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200"
                ></textarea>
            </div>

            {/* Tags */}
            <div className="mb-6">
                <label htmlFor="tags" className="block mb-2 text-sm font-medium text-slate-400">Tag (Tema de tu tarea)</label>
                <input
                    type="text"
                    id="tags"
                    onChange={(e) => { setTags(e.target.value); }}
                    value={tags}
                    placeholder="Ej: Trabajo"
                    className="w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200"
                />
                {!loading && oTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {oTags.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => {setTags(tag.name); }}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${tags === tag.name ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Priority and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label htmlFor="priority" className="block mb-2 text-sm font-medium text-slate-400">Prioridad</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200 appearance-none"
                    >
                        <option value="BAJA">Baja</option>
                        <option value="MEDIA">Media</option>
                        <option value="ALTA">Alta</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dueDate" className="block mb-2 text-sm font-medium text-slate-400">Fecha de Expiración</label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="dueTime" className="block mb-2 text-sm font-medium text-slate-400">Hora</label>
                        <input
                            type="time"
                            id="dueTime"
                            value={dueTime}
                            onChange={(e) => setDueTime(e.target.value)}
                            className="w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 rounded-md bg-sky-600 hover:bg-sky-500 transition-colors font-semibold"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    )
}
