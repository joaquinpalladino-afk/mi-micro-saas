'use client'

import { useState, useMemo } from 'react'
import TaskPending from '@/components/TaskPending';
import TaskCompleted from '@/components/TaskCompleted';
import Alert from '@/components/ui/Alert';

export default function TasksManager({ initialTasks, user, allTags: initialTags }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [allTags, setAllTags] = useState(initialTags);
  const [selectedTag, setSelectedTag] = useState('');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [error, setError] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const handleDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const sortedAndFilteredTasks = useMemo(() => {
    const priorityValues = { ALTA: 3, MEDIA: 2, BAJA: 1 };

    let filteredTasks = tasks;

    if (terminoBusqueda) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
    }

    if (selectedTag) {
      filteredTasks = filteredTasks.filter((task) =>
        task.tags && task.tags.some((tag) => tag.name === selectedTag)
      );
    }

    const scoredTasks = filteredTasks.map(task => {
      const daysRemaining = task.dueDate ? (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24) : 0;
      const score = (priorityValues[task.priority] || 0) * 10 - daysRemaining;
      return { ...task, score };
    });

    scoredTasks.sort((a, b) => b.score - a.score);

    return scoredTasks;
  }, [tasks, terminoBusqueda, selectedTag]);

  async function updateCompleted(id, originalCompleted) {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const tagName = task.tags && task.tags.length > 0 ? task.tags[0].name : null;

    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...task,
        tags: tagName,
        completed: !originalCompleted,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al actualizar la tarea.");
    }
  }

  const pendingTasks = sortedAndFilteredTasks.filter((task) => !task.completed);
  const completedTasks = sortedAndFilteredTasks.filter((task) => task.completed);

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setUpdatingTaskId(id);
    setError(null); 
    const originalCompleted = task.completed;

    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      await updateCompleted(id, originalCompleted);
    } catch (error) {
      console.error("Failed to update task:", error);
      setError("No se pudo actualizar la tarea. Inténtalo de nuevo.");
      // Revert UI on error
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === id ? { ...t, completed: originalCompleted } : t
        )
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <div className="container mx-auto">
      {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
      
      <header className="mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Tus Tareas</h1>
          {user && <p className="text-md sm:text-lg text-slate-400 mt-1">Hola, {user.username}</p>}
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          className="w-full md:flex-1 bg-slate-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow shadow-sm"
          placeholder="Buscar tareas por título..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />
        <select
          className="w-full md:w-auto md:min-w-[200px] bg-slate-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow shadow-sm appearance-none"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">Todas las etiquetas</option>
          {allTags.map((tag) => (
            <option key={tag.id} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b-2 border-slate-700 pb-3 flex items-center gap-3">
            <span className="text-yellow-400">🚧</span>
            Pendientes
          </h2>
          <TaskPending onDelete={handleDelete} tasks={pendingTasks} onToggle={toggleTask} updatingTaskId={updatingTaskId} />
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b-2 border-slate-700 pb-3 flex items-center gap-3">
            <span className="text-green-400">✅</span>
            Completadas
          </h2>
          <TaskCompleted onDelete={handleDelete} tasks={completedTasks} onToggle={toggleTask} updatingTaskId={updatingTaskId} />
        </section>
      </div>
    </div>
  );
}
