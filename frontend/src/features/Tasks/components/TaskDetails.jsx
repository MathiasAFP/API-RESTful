export default function TaskDetails({ task, onClose }) {
  if (!task) return null;

  const taskTitulo = task.titulo || task.title;
  const taskDescricao = task.descricao || task.description;
  const taskStatus = task.status;
  const memberNome = task.membroId?.nome || 'Sem responsável';
  const teamNome = task.membroId?.projetoId?.nome || null;

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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{taskTitulo}</h2>
            <div className="flex items-center gap-4 flex-wrap">
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  statusColors[taskStatus] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {statusLabels[taskStatus] || taskStatus}
              </span>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Responsável:</span> {memberNome}
              </p>
              {teamNome && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Equipe:</span> {teamNome}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-4"
          >
            Fechar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {taskDescricao ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{taskDescricao}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">Nenhuma descrição fornecida para esta tarefa.</p>
          )}
        </div>
      </div>
    </div>
  );
}

