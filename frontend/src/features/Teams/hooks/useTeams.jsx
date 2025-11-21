import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/api-client';

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await apiClient.get('/teams');
        setTeams(data);
      } catch (error) {
        console.error('[v0] Erro ao carregar equipes:', error);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/teams/${id}`);
      setTeams(teams.filter(t => t.id !== id));
    } catch (error) {
      console.error('[v0] Erro ao deletar equipe:', error);
    }
  };

  const handleCreate = async (team) => {
    try {
      const newTeam = await apiClient.post('/teams', team);
      setTeams([...teams, newTeam]);
    } catch (error) {
      console.error('[v0] Erro ao criar equipe:', error);
    }
  };

  return { teams, loading, handleDelete, handleCreate };
}
