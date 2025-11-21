import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api-client';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', status: 'pending' });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await apiClient.get('/tasks');
        setTasks(data);
      } catch (error) {
        console.error('[v0] Erro ao carregar tarefas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      try {
        const newTask = await apiClient.post('/tasks', formData);
        setTasks([...tasks, newTask]);
        setFormData({ title: '', status: 'pending' });
        setShowForm(false);
      } catch (error) {
        console.error('[v0] Erro ao criar tarefa:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('[v0] Erro ao deletar tarefa:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await apiClient.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch (error) {
      console.error('[v0] Erro ao atualizar tarefa:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tarefas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Nova Tarefa
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <input
            type="text"
            placeholder="Título"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:border-blue-500"
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:border-blue-500"
          >
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Progresso</option>
            <option value="completed">Concluído</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Criar
          </button>
        </form>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Progresso</option>
                <option value="completed">Concluído</option>
              </select>
              <button
                onClick={() => handleDelete(task.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
