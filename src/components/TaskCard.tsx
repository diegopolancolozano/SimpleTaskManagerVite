import type { Task } from '../types/Task';
import '../styles/TaskCard.css';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue = dueDate < today && !task.completed;
  const isDueToday = dueDate.toDateString() === today.toDateString();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-header">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="task-checkbox"
        />
        <h3 className="task-title">{task.title}</h3>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <div className={`task-date ${isDueToday ? 'due-today' : ''} ${isOverdue ? 'overdue-text' : ''}`}>
          {formatDate(task.dueDate)}
          {isDueToday && ' (Hoy)'}
          {isOverdue && ' (Vencida)'}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="btn-delete"
          title="Eliminar tarea"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
