import { useState } from 'react';
import type { Task } from '../types/Task';
import '../styles/TaskForm.css';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
  onClose: () => void;
}

export function TaskForm({ onAddTask, onClose }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !dueDate) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setDueDate('');
    onClose();
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <h2>Nueva Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa el título de la tarea"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ingresa una descripción (opcional)"
              rows={4}
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Fecha de vencimiento *</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
