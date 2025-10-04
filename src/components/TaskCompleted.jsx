import Link from 'next/link';
import { BDelete, BEdit } from './Buttons';

const priorityStyles = {
  ALTA: 'bg-red-500',
  MEDIA: 'bg-yellow-500',
  BAJA: 'bg-green-500',
};

const TaskCard = ({ task, onToggle, onDelete, updatingTaskId }) => {
  const hasDetails = task.priority || task.dueDate || (task.tags && task.tags.length > 0);
  const isUpdating = updatingTaskId === task.id;

  return (
    <div className={`bg-slate-800/70 rounded-lg shadow-md hover:bg-slate-700/60 transition-all duration-200 flex flex-col opacity-80 hover:opacity-100 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <Link href={`/tasks/${task.id}`} className="p-4 flex-grow">
        <h3 className="font-bold text-lg text-slate-400 line-through">
          {task.title}
        </h3>
        {task.descrition && (
          <p className="text-sm text-slate-500 line-through mt-2">
            {task.descrition}
          </p>
        )}

        {hasDetails && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-500">
            {task.priority && (
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${priorityStyles[task.priority] || 'bg-gray-400'}`}></span>
                Prioridad {task.priority}
              </span>
            )}
            {task.dueDate && (
              <span className="flex items-center gap-1.5">
                <span>🗓️</span>
                Expira: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {task.tags.map((tag) => (
              <span key={tag.id} className="px-2.5 py-1 bg-slate-700/80 rounded-full text-xs font-medium text-slate-400">
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
          htmlFor={`task-completed-${task.id}`}
          className="flex items-center cursor-pointer text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors whitespace-nowrap"
        >
          <input
            id={`task-completed-${task.id}`}
            type="checkbox"
            onChange={() => onToggle(task.id)}
            checked={task.completed}
            disabled={isUpdating}
            className="w-5 h-5 accent-yellow-500 mr-2 cursor-pointer"
          />
          Deshacer
        </label>
      </div>
    </div>
  );
};

export default function TaskCompleted({ tasks, onToggle, onDelete, updatingTaskId }) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-700">
        <p className="text-slate-400 text-center">Aún no has completado ninguna tarea.</p>
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
