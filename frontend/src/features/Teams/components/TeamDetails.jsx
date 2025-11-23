import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import TaskDetails from '../../Tasks/components/TaskDetails';

export default function TeamDetails({ team, onClose, onUpdate, onAddMember, startInEditMode = false }) {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(startInEditMode);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState({
    nome: team.nome || team.name || '',
    descricao: team.descricao || team.description || ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    setFormData({
      nome: team.nome || team.name || '',
      descricao: team.descricao || team.description || ''
    });
  }, [team]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [membersData, tasksData] = await Promise.all([
          api.get('/membros'),
          api.get('/tarefas')
        ]);

        const teamId = team._id || team.id;
        const teamMembers = membersData.filter(m => {
          const memberProjetoId = m.projetoId?._id || m.projetoId || m.projetoId?.id;
          return memberProjetoId === teamId || memberProjetoId?.toString() === teamId?.toString();
        });
        setMembers(teamMembers);

        const teamTasks = tasksData.filter(t => {
          const taskMembroId = t.membroId?._id || t.membroId;
          if (!taskMembroId) return false;
          return teamMembers.some(m => {
            const memberId = m._id || m.id;
            const memberIdStr = memberId?.toString();
            const taskMembroIdStr = taskMembroId?.toString();
            return memberIdStr === taskMembroIdStr;
          });
        });
        setTasks(teamTasks);
      } catch (error) {
        console.error('[v0] Erro ao carregar detalhes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleViewTask = (event) => {
      setSelectedTask(event.detail);
    };

    window.addEventListener('viewTaskDetails', handleViewTask);
    return () => {
      window.removeEventListener('viewTaskDetails', handleViewTask);
    };
  }, [team, refreshKey]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome || formData.nome.trim().length === 0) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    const result = await onUpdate(team._id || team.id, formData);
    if (result.success) {
      setShowEditForm(false);
      setRefreshKey(prev => prev + 1);
    }
  };

  const teamId = team._id || team.id;
  const teamName = team.nome || team.name;
  const teamDescription = team.descricao || team.description;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div className="flex-1">
            {showEditForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => {
                      setFormData({ ...formData, nome: e.target.value });
                      if (formErrors.nome) setFormErrors({ ...formErrors, nome: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded ${
                      formErrors.nome ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                  {formErrors.nome && <p className="text-red-500 text-sm mt-1">{formErrors.nome}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows="3"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setFormData({
                        nome: team.nome || team.name || '',
                        descricao: team.descricao || team.description || ''
                      });
                      setFormErrors({});
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{teamName}</h2>
                <p className="text-gray-600">{teamDescription || 'Sem descrição'}</p>
              </>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            {!showEditForm && (
              <button
                onClick={() => setShowEditForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Editar
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Fechar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Membros ({members.length})</h3>
                  {onAddMember && (
                    <button
                      onClick={() => {
                        onAddMember(teamId, teamName);
                        onClose();
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      + Adicionar Membro
                    </button>
                  )}
                </div>
                {members.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum membro nesta equipe</p>
                ) : (
                  <div className="space-y-4">
                    {members.map((member) => {
                      const memberId = member._id || member.id;
                      const memberNome = member.nome || member.name;
                      const memberIdStr = memberId?.toString();
                      const memberTasks = tasks.filter(t => {
                        const taskMembroId = t.membroId?._id || t.membroId;
                        if (!taskMembroId) return false;
                        const taskMembroIdStr = taskMembroId?.toString();
                        return memberIdStr === taskMembroIdStr;
                      });

                      return (
                        <div
                          key={memberId}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-lg">{memberNome}</h4>
                            <span className="text-sm text-gray-500">
                              {memberTasks.length} {memberTasks.length === 1 ? 'tarefa' : 'tarefas'}
                            </span>
                          </div>
                          {memberTasks.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Nenhuma tarefa atribuída</p>
                          ) : (
                            <div className="space-y-2">
                              {memberTasks.map((task) => {
                                const taskId = task._id || task.id;
                                const taskTitulo = task.titulo || task.title;
                                const taskStatus = task.status;
                                const statusLabels = {
                                  pending: 'Pendente',
                                  in_progress: 'Em Progresso',
                                  completed: 'Concluído'
                                };
                                const statusColors = {
                                  pending: 'bg-yellow-100 text-yellow-800',
                                  in_progress: 'bg-blue-100 text-blue-800',
                                  completed: 'bg-green-100 text-green-800'
                                };

                                return (
                                  <div
                                    key={taskId}
                                    onClick={() => {
                                      const event = new CustomEvent('viewTaskDetails', { detail: task });
                                      window.dispatchEvent(event);
                                    }}
                                    className="bg-white border border-gray-300 rounded p-3 cursor-pointer hover:bg-gray-50 transition"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <h5 className="font-medium text-gray-900">{taskTitulo}</h5>
                                        {task.descricao && (
                                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {task.descricao}
                                          </p>
                                        )}
                                      </div>
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-medium ml-2 ${
                                          statusColors[taskStatus] || 'bg-gray-100 text-gray-800'
                                        }`}
                                      >
                                        {statusLabels[taskStatus] || taskStatus}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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

