// Card de equipe

export default function TeamCard({ team, onDelete, onAddMember }) {
  const teamId = team._id || team.id;
  const teamName = team.nome || team.name;
  const teamDescription = team.descricao || team.description;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-gray-900 mb-2">{teamName}</h3>
      <p className="text-sm text-gray-600 mb-4">{teamDescription || 'Sem descrição'}</p>
      <div className="flex flex-col gap-2">
        {onAddMember && (
          <button
            onClick={() => onAddMember(teamId, teamName)}
            className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Adicionar Membro
          </button>
        )}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
            Editar
          </button>
          <button
            onClick={() => onDelete(teamId)}
            className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
