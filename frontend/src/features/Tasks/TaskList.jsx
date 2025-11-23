import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ titulo: '', status: 'pending' });
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await api.get('/tarefas');
        setTasks(data);
        setError('');
      } catch (error) {
        console.error('[v0] Erro ao carregar tarefas:', error);
        setError('Erro ao carregar tarefas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setError('');

    if (!formData.titulo || formData.titulo.trim().length === 0) {
      setFormErrors({ titulo: 'Título é obrigatório' });
      return;
    }

    try {
      const newTask = await api.post('/tarefas', {
        titulo: formData.titulo.trim(),
        status: formData.status
      });
      setTasks([...tasks, newTask]);
      setFormData({ titulo: '', status: 'pending' });
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('[v0] Erro ao criar tarefa:', error);
      setError(error.data?.message || 'Erro ao criar tarefa. Tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      return;
    }

    try {
      await api.delete(`/tarefas/${id}`);
      setTasks(tasks.filter(t => t._id !== id && t.id !== id));
      setError('');
    } catch (error) {
      console.error('[v0] Erro ao deletar tarefa:', error);
      if (error.status === 404) {
        setError('Tarefa não encontrada');
      } else {
        setError(error.data?.message || 'Erro ao deletar tarefa. Tente novamente.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await api.put(`/tarefas/${id}`, { status: newStatus });
      setTasks(tasks.map(t => (t._id === id || t.id === id) ? updated : t));
      setError('');
    } catch (error) {
      console.error('[v0] Erro ao atualizar tarefa:', error);
      if (error.status === 404) {
        setError('Tarefa não encontrada');
      } else {
        setError(error.data?.message || 'Erro ao atualizar tarefa. Tente novamente.');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tarefas</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormErrors({});
            setError('');
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Nova Tarefa
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Título"
              value={formData.titulo}
              onChange={(e) => {
                setFormData({ ...formData, titulo: e.target.value });
                if (formErrors.titulo) setFormErrors({ ...formErrors, titulo: '' });
              }}
              className={`w-full px-3 py-2 border rounded ${
                formErrors.titulo ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              } focus:outline-none`}
            />
            {formErrors.titulo && <p className="text-red-500 text-sm mt-1">{formErrors.titulo}</p>}
          </div>
          <div className="mb-3">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Progresso</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Criar
          </button>
        </form>
      )}

      <div className="space-y-3">
        {tasks.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">Nenhuma tarefa encontrada</div>
        )}
        {tasks.map((task) => {
          const taskId = task._id || task.id;
          return (
            <div key={taskId} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{task.titulo || task.title}</h3>
                {task.descricao && <p className="text-sm text-gray-600">{task.descricao}</p>}
              </div>
              <div className="flex gap-2 ml-4">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(taskId, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="completed">Concluído</option>
                </select>
                <button
                  onClick={() => handleDelete(taskId)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Deletar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
