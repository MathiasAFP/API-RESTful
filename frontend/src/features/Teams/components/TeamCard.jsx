// Card de equipe

export default function TeamCard({ team, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-gray-900 mb-2">{team.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{team.description || 'Sem descrição'}</p>
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
          Editar
        </button>
        <button
          onClick={() => onDelete(team.id)}
          className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
