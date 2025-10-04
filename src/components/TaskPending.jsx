import Link from 'next/link';
import { BDelete, BEdit } from './Buttons';
import { useEffect } from 'react';

const priorityStyles = {
  ALTA: 'bg-red-500',
  MEDIA: 'bg-yellow-500',
  BAJA: 'bg-green-500',
};

const TaskCard = ({ task, onToggle, onDelete, updatingTaskId }) => {
  const hasDetails = task.priority || task.dueDate || (task.tags && task.tags.length > 0);
  const isUpdating = updatingTaskId === task.id;

  return (
    <div className={`bg-slate-800 rounded-lg shadow-md hover:bg-slate-700/80 transition-all duration-200 flex flex-col ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <Link href={`/tasks/${task.id}`} className="p-4 flex-grow">
        <h3 className="font-bold text-lg text-slate-200 group-hover:text-sky-400 transition-colors">
          {task.title}
        </h3>
        {task.descrition && (
          <p className="text-sm text-slate-400 mt-2">
            {task.descrition}
          </p>
        )}

        {hasDetails && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-400">
            {task.priority && (
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${priorityStyles[task.priority] || 'bg-gray-400'}`}></span>
                Prioridad {task.priority}
              </span>
            )}
            {task.dueDate && (
              <span className={`flex items-center gap-1.5 ${task.expired ? 'text-red-400' : ''}`}>
                <span>🗓️</span>
                {task.expired ? 'Expiró' : 'Expira'}: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {task.tags.map((tag) => (
              <span key={tag.id} className="px-2.5 py-1 bg-slate-700 rounded-full text-xs font-medium">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-slate-700/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <BEdit id={task.id} disabled={isUpdating} />
          <BDelete id={task.id} setIsDelete={onDelete} disabled={isUpdating} />
        </div>
        <label
          htmlFor={`task-pending-${task.id}`}
          className="flex items-center cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
        >
          <input
            id={`task-pending-${task.id}`}
            type="checkbox"
            onChange={() => onToggle(task.id)}
            checked={task.completed}
            disabled={isUpdating}
            className="w-5 h-5 accent-sky-500 mr-2 cursor-pointer"
          />
          Completar
        </label>
      </div>
    </div>
  );
};

export default function TaskPending({ tasks, onToggle, onDelete, updatingTaskId }) {
  useEffect(() => {
    const updateExpiredStatus = async (task) => {
      if (!task || task.expired) return;

      const tagName = task.tags && task.tags.length > 0 ? task.tags[0].name : null;

      try {
        await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...task, tags: tagName, expired: true }),
        });
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    };

    const currentDate = new Date();
    tasks.forEach((task) => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (dueDate < currentDate && !task.expired) {
          updateExpiredStatus(task);
        }
      }
    });
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
        <p className="text-slate-400 text-center">Aún no tienes ninguna tarea pendiente.</p>
        <Link href="/new" className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500 transition-colors font-semibold">
            Crear una nueva tarea
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} updatingTaskId={updatingTaskId} />
      ))}
    </div>
  );
}
