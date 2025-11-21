import { useState } from 'react';
import { useTeams } from './hooks/useTeams';
import TeamCard from './components/TeamCard';

export default function TeamList() {
  const { teams, loading, handleDelete, handleCreate } = useTeams();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      handleCreate(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Equipes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Nova Equipe
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <input
            type="text"
            placeholder="Nome da equipe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Criar
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
