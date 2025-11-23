import { useState, useEffect } from 'react';
import { api } from '../../../services/api';

export function useMembers(teamId = null) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await api.get('/membros');
        setMembers(data);
        setError('');
      } catch (error) {
        console.error('[v0] Erro ao carregar membros:', error);
        setError(error.data?.message || 'Erro ao carregar membros. Tente novamente.');
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/membros/${id}`);
      setMembers(members.filter(m => (m._id !== id && m.id !== id)));
      setError('');
      return true;
    } catch (error) {
      console.error('[v0] Erro ao deletar membro:', error);
      if (error.status === 404) {
        setError('Membro não encontrado');
      } else {
        setError(error.data?.message || 'Erro ao deletar membro. Tente novamente.');
      }
      return false;
    }
  };

  const handleCreate = async (member) => {
    try {
      const newMember = await api.post('/membros', {
        nome: member.nome || member.name,
        projetoId: member.projetoId || member.team
      });
      setMembers([...members, newMember]);
      setError('');
      return { success: true, data: newMember };
    } catch (error) {
      console.error('[v0] Erro ao criar membro:', error);
      const errorMessage = error.data?.message || 'Erro ao criar membro. Tente novamente.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return { members, loading, error, handleDelete, handleCreate };
}
