import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/api-client';

export function useMembers(teamId = null) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await apiClient.get('/members');
        setMembers(data);
      } catch (error) {
        console.error('[v0] Erro ao carregar membros:', error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/members/${id}`);
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error('[v0] Erro ao deletar membro:', error);
    }
  };

  const handleCreate = async (member) => {
    try {
      const newMember = await apiClient.post('/members', member);
      setMembers([...members, newMember]);
    } catch (error) {
      console.error('[v0] Erro ao criar membro:', error);
    }
  };

  return { members, loading, handleDelete, handleCreate };
}
