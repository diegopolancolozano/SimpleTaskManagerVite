import { useState, useEffect } from 'react';
import type { Task } from '../types/Task';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import '../styles/TaskManager.css';

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Cargar tareas del localStorage al montar el componente
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Guardar tareas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && !task.completed;
  }).length;

  // Ordenar tareas: primero sin completar, luego completadas
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="task-manager">
      <div className="task-manager-container">
        <div className="task-manager-header">
          <h1>Gestor de Tareas</h1>
          <p>Organiza tus tareas de manera simple y eficaz</p>
        </div>

        <div className="task-manager-content">
          <div className="task-manager-actions">
            <button
              onClick={() => setShowForm(true)}
              className="btn-create"
            >
              ➕ Nueva Tarea
            </button>
          </div>

          {totalTasks > 0 && (
            <div className="tasks-stats">
              <div className="stat-card active">
                <div className="stat-number">{totalTasks}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{activeTasks}</div>
                <div className="stat-label">Activas</div>
              </div>
              <div className="stat-card completed">
                <div className="stat-number">{completedTasks}</div>
                <div className="stat-label">Completadas</div>
              </div>
              {overdueTasks > 0 && (
                <div className="stat-card" style={{ background: '#dc3545', color: 'white' }}>
                  <div className="stat-number">{overdueTasks}</div>
                  <div className="stat-label">Vencidas</div>
                </div>
              )}
            </div>
          )}

          <div className="tasks-container">
            <div className="tasks-header">
              <h2>
                {totalTasks === 0 ? 'Sin tareas' : `${activeTasks} tarea${activeTasks !== 1 ? 's' : ''} pendiente${activeTasks !== 1 ? 's' : ''}`}
              </h2>
            </div>
            <div className="tasks-list">
              {totalTasks === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"></div>
                  <p className="empty-state-text">
                    No hay tareas. Crea una para empezar.
                  </p>
                </div>
              ) : (
                sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <TaskForm
          onAddTask={handleAddTask}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
