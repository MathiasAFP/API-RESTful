import { useState } from 'react';
import { useMembers } from './hooks/useMembersMembers';

export default function MemberList() {
  const { members, loading, handleDelete, handleCreate } = useMembers();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', team: 1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      handleCreate(formData);
      setFormData({ name: '', team: 1 });
      setShowForm(false);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Membros</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Novo Membro
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <input
            type="text"
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Criar
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Equipe</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{member.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{member.teamName || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
