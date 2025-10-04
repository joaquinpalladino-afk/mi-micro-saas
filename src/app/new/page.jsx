'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default function NewTaskPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [oTags, setOTags] = useState([]);
    const [priority, setPriority] = useState('MEDIA');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [fullDueDate, setFullDueDate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingTags, setLoadingTags] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const loadTags = async () => {
            try {
                const response = await fetch('/api/tags');
                if (!response.ok) {
                    toast.error("No se pudieron cargar los tags.");
                    return;
                }
                const data = await response.json();
                setOTags(data);
            } catch (error) {
                console.error("Error fetching tags:", error);
                toast.error("No se pudieron cargar los tags. No podrás seleccionar o crear nuevos tags.");
            } finally {
                setLoadingTags(false);
            }
        }
        loadTags();
    }, []);

    useEffect(() => {
        if (dueDate && dueTime) {
            const combinedDateTime = new Date(`${dueDate}T${dueTime}`);
            setFullDueDate(combinedDateTime.toISOString());
        } else if (dueDate) {
            const combinedDateTime = new Date(`${dueDate}T00:00:00`);
            setFullDueDate(combinedDateTime.toISOString());
        } else {
            setFullDueDate(null);
        }
    }, [dueDate, dueTime]);


    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const promise = () => new Promise(async (resolve, reject) => {
            try {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        tags,
                        priority,
                        dueDate: fullDueDate
                    })
                });

                if (response.ok) {
                    resolve(response);
                } else {
                    const errorData = await response.json().catch(() => null);
                    reject(errorData?.message || "Ocurrió un error al crear la tarea.");
                }
            } catch (error) {
                console.error("Submission error:", error);
                reject("Error de conexión. No se pudo crear la tarea.");
            }
        });

        toast.promise(promise(), {
            loading: 'Creando tarea...',
            success: () => {
                router.push("/");
                router.refresh();
                return "Tarea creada con éxito!";
            },
            error: (err) => err,
            finally: () => setIsSubmitting(false)
        });
    }

    return (
        <main className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-8">
            <div className="container mx-auto max-w-2xl">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold">Crear Nueva Tarea</h1>
                </header>

                <form onSubmit={onSubmit} className="bg-slate-800 p-6 sm:p-8 rounded-lg shadow-lg">
                    {/* Title */}
                    <div className="mb-6">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-slate-400">Título</label>
                        <input
                            type="text"
                            id="title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            placeholder="Ej: Estudiar para el examen"
                            className="w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-slate-400">Descripción</label>
                        <textarea
                            id="description"
                            placeholder="Detalles de la tarea..."
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            rows="4"
                            className="w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200"
                        ></textarea>
                    </div>

                    {/* Tag */}
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
                        {!loadingTags && oTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {oTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => { setTags(tag.name); }}
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

                    {/* Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3 flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-500 transition-colors font-semibold disabled:bg-sky-800 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <SpinnerIcon />}
                            {isSubmitting ? 'Creando...' : 'Crear Tarea'}
                        </button>
                    </div>
                </form>

            </div>
        </main>
    )
}