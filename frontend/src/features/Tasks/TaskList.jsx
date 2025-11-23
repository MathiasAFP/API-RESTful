import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import TaskDetails from './components/TaskDetails';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ titulo: '', descricao: '', status: 'pending', projetoId: '', membroId: '' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [members, setMembers] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

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

    const fetchMembers = async () => {
      try {
        const data = await api.get('/membros');
        setMembers(data);
      } catch (error) {
        console.error('[v0] Erro ao carregar membros:', error);
      }
    };

    const fetchProjetos = async () => {
      try {
        const data = await api.get('/projetos');
        setProjetos(data);
      } catch (error) {
        console.error('[v0] Erro ao carregar projetos:', error);
      }
    };

    fetchTasks();
    fetchMembers();
    fetchProjetos();
  }, []);

  // Filtrar membros quando projetoId mudar
  useEffect(() => {
    if (formData.projetoId) {
      const projetoIdStr = formData.projetoId.toString();
      const filtered = members.filter(m => {
        const memberProjetoId = m.projetoId?._id || m.projetoId || m.projetoId?.id;
        return memberProjetoId?.toString() === projetoIdStr;
      });
      setFilteredMembers(filtered);
      // Limpar membroId se o projeto mudar
      if (formData.membroId) {
        const membroStillValid = filtered.some(m => {
          const memberId = m._id || m.id;
          return memberId?.toString() === formData.membroId?.toString();
        });
        if (!membroStillValid) {
          setFormData(prev => ({ ...prev, membroId: '' }));
        }
      }
    } else {
      setFilteredMembers([]);
      setFormData(prev => ({ ...prev, membroId: '' }));
    }
  }, [formData.projetoId, members]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setError('');

    if (!formData.titulo || formData.titulo.trim().length === 0) {
      setFormErrors({ titulo: 'Título é obrigatório' });
      return;
    }

    try {
      const taskData = {
        titulo: formData.titulo.trim(),
        status: formData.status
      };
      
      if (formData.descricao && formData.descricao.trim()) {
        taskData.descricao = formData.descricao.trim();
      }
      
      if (formData.membroId && formData.membroId.trim() !== '') {
        taskData.membroId = formData.membroId.trim();
      }

      const newTask = await api.post('/tarefas', taskData);
      
      // Recarregar tarefas para garantir que os dados populados estejam corretos
      const updatedTasks = await api.get('/tarefas');
      setTasks(updatedTasks);
      setFormData({ titulo: '', descricao: '', status: 'pending', projetoId: '', membroId: '' });
      setFilteredMembers([]);
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
            if (!showForm) {
              setFormData({ titulo: '', descricao: '', status: 'pending', projetoId: '', membroId: '' });
              setFilteredMembers([]);
            }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              rows="3"
              placeholder="Descrição da tarefa (opcional)"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipe</label>
            <select
              value={formData.projetoId}
              onChange={(e) => {
                setFormData({ ...formData, projetoId: e.target.value, membroId: '' });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Selecione uma equipe</option>
              {projetos.map((projeto) => {
                const projetoId = projeto._id || projeto.id;
                const projetoIdStr = projetoId?.toString();
                const projetoNome = projeto.nome || projeto.name;
                return (
                  <option key={projetoIdStr} value={projetoIdStr}>
                    {projetoNome}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Membro Responsável (Opcional)</label>
            <select
              value={formData.membroId}
              onChange={(e) => setFormData({ ...formData, membroId: e.target.value })}
              disabled={!formData.projetoId}
              className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 ${
                !formData.projetoId ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="">
                {formData.projetoId ? 'Nenhum membro' : 'Selecione uma equipe primeiro'}
              </option>
              {filteredMembers.map((member) => {
                const memberId = member._id || member.id;
                const memberIdStr = memberId?.toString();
                const memberNome = member.nome || member.name;
                return (
                  <option key={memberIdStr} value={memberIdStr}>
                    {memberNome}
                  </option>
                );
              })}
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
            <div 
              key={taskId} 
              onClick={() => setSelectedTask(task)}
              className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{task.titulo || task.title}</h3>
                {(() => {
                  // Verificar se membroId existe e está populado
                  const membroId = task.membroId;
                  
                  if (membroId) {
                    // Verificar se é um objeto populado (não apenas um ID string)
                    if (typeof membroId === 'object' && membroId !== null && !Array.isArray(membroId)) {
                      // Objeto populado - verificar se tem nome (indica que foi populado corretamente)
                      if (membroId.nome) {
                        // Obter nome do projeto/equipe
                        let projetoNome = null;
                        if (membroId.projetoId) {
                          if (typeof membroId.projetoId === 'object' && membroId.projetoId !== null) {
                            projetoNome = membroId.projetoId.nome;
                          } else {
                            projetoNome = membroId.projetoId;
                          }
                        }
                        
                        return (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Responsável:</span> {membroId.nome}
                            {projetoNome && (
                              <span className="ml-4">
                                <span className="font-medium">Equipe:</span> {projetoNome}
                              </span>
                            )}
                          </p>
                        );
                      }
                      // Objeto mas sem nome - pode ser um objeto vazio ou com apenas _id
                      // Isso indica que o populate não funcionou ou o membro foi deletado
                    } else if (typeof membroId === 'string' && membroId.trim() !== '') {
                      // Apenas ID string - não foi populado
                      // Isso não deveria acontecer se o backend estiver populando corretamente
                    }
                  }
                  
                  // Sem membroId ou membroId não populado corretamente
                  return (
                    <p className="text-sm text-gray-500 italic mt-1">Sem responsável atribuído</p>
                  );
                })()}
                {task.descricao && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.descricao}</p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <select
                  value={task.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleStatusChange(taskId, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="completed">Concluído</option>
                </select>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(taskId);
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Deletar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
