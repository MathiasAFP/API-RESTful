import { useState } from 'react';
import { useTeams } from './hooks/useTeams';
import TeamCard from './components/TeamCard';
import TeamDetails from './components/TeamDetails';

export default function TeamList({ onAddMemberToProject }) {
  const { teams, loading, error, handleDelete, handleCreate, handleUpdate } = useTeams();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [formErrors, setFormErrors] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);

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

    const result = await handleCreate(formData);
    if (result.success) {
      setFormData({ nome: '', descricao: '' });
      setShowForm(false);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Equipes</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormErrors({});
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Nova Equipe
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Nome da equipe"
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
          <div className="mb-3">
            <input
              type="text"
              placeholder="Descrição"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Criar
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.length === 0 && !loading && (
          <div className="col-span-full text-center py-8 text-gray-500">Nenhum projeto encontrado</div>
        )}
        {teams.map((team) => {
          const teamId = team._id || team.id;
          return (
            <TeamCard
              key={teamId}
              team={team}
              onDelete={handleDelete}
              onAddMember={onAddMemberToProject}
              onViewDetails={(team) => setSelectedTeam(team)}
              onEdit={(team) => {
                setEditingTeam(team);
                setSelectedTeam(team);
              }}
            />
          );
        })}
      </div>

      {selectedTeam && (
        <TeamDetails
          team={selectedTeam}
          startInEditMode={editingTeam !== null}
          onClose={() => {
            setSelectedTeam(null);
            setEditingTeam(null);
          }}
          onUpdate={async (id, data) => {
            const result = await handleUpdate(id, data);
            if (result.success) {
              setSelectedTeam(result.data);
              setEditingTeam(null);
            }
            return result;
          }}
          onAddMember={onAddMemberToProject}
        />
      )}
    </div>
  );
}
