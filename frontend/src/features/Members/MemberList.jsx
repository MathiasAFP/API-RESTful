import { useState, useEffect } from 'react';
import { useMembers } from './hooks/useMembersMembers';
import { api } from '../../services/api';

export default function MemberList() {
  const { members, loading, error, handleDelete, handleCreate } = useMembers();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nome: '', projetoId: '' });
  const [formErrors, setFormErrors] = useState({});
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const data = await api.get('/projetos');
        setProjetos(data);
      } catch (error) {
        console.error('[v0] Erro ao carregar projetos:', error);
      }
    };
    fetchProjetos();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome || formData.nome.trim().length === 0) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.projetoId || formData.projetoId === '') {
      newErrors.projetoId = 'Projeto é obrigatório';
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
      setFormData({ nome: '', projetoId: '' });
      setShowForm(false);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Membros</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormErrors({});
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Novo Membro
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Nome"
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
            <select
              value={formData.projetoId}
              onChange={(e) => {
                setFormData({ ...formData, projetoId: e.target.value });
                if (formErrors.projetoId) setFormErrors({ ...formErrors, projetoId: '' });
              }}
              className={`w-full px-3 py-2 border rounded ${
                formErrors.projetoId ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              } focus:outline-none`}
            >
              <option value="">Selecione um projeto</option>
              {projetos.map((projeto) => {
                const projetoId = projeto._id || projeto.id;
                const projetoNome = projeto.nome || projeto.name;
                return (
                  <option key={projetoId} value={projetoId}>
                    {projetoNome}
                  </option>
                );
              })}
            </select>
            {formErrors.projetoId && <p className="text-red-500 text-sm mt-1">{formErrors.projetoId}</p>}
          </div>
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Projeto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && !loading && (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                  Nenhum membro encontrado
                </td>
              </tr>
            )}
            {members.map((member) => {
              const memberId = member._id || member.id;
              const memberNome = member.nome || member.name;
              const projetoNome = member.projetoId?.nome || member.teamName || 'N/A';
              return (
                <tr key={memberId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{memberNome}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{projetoNome}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja deletar este membro?')) {
                          handleDelete(memberId);
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
