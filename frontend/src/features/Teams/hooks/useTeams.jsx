import { useState, useEffect } from 'react';
import { api } from '../../../services/api';

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await api.get('/projetos');
        setTeams(data);
        setError('');
      } catch (error) {
        console.error('[v0] Erro ao carregar equipes:', error);
        setError(error.data?.message || 'Erro ao carregar projetos. Tente novamente.');
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projetos/${id}`);
      setTeams(teams.filter(t => (t._id !== id && t.id !== id)));
      setError('');
      return true;
    } catch (error) {
      console.error('[v0] Erro ao deletar equipe:', error);
      if (error.status === 404) {
        setError('Projeto não encontrado');
      } else {
        setError(error.data?.message || 'Erro ao deletar projeto. Tente novamente.');
      }
      return false;
    }
  };

  const handleCreate = async (team) => {
    try {
      const newTeam = await api.post('/projetos', {
        nome: team.nome || team.name,
        descricao: team.descricao || team.description
      });
      setTeams([...teams, newTeam]);
      setError('');
      return { success: true, data: newTeam };
    } catch (error) {
      console.error('[v0] Erro ao criar equipe:', error);
      const errorMessage = error.data?.message || 'Erro ao criar projeto. Tente novamente.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleUpdate = async (id, team) => {
    try {
      const updatedTeam = await api.put(`/projetos/${id}`, {
        nome: team.nome || team.name,
        descricao: team.descricao || team.description
      });
      setTeams(teams.map(t => (t._id === id || t.id === id) ? updatedTeam : t));
      setError('');
      return { success: true, data: updatedTeam };
    } catch (error) {
      console.error('[v0] Erro ao atualizar equipe:', error);
      if (error.status === 404) {
        setError('Projeto não encontrado');
      } else {
        setError(error.data?.message || 'Erro ao atualizar projeto. Tente novamente.');
      }
      return { success: false, error: error.data?.message || 'Erro ao atualizar projeto. Tente novamente.' };
    }
  };

  return { teams, loading, error, handleDelete, handleCreate, handleUpdate };
}
