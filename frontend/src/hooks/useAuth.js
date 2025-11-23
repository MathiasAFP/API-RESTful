import { useState } from 'react';
import { api } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, senha) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/usuario/login', { email, senha });
      localStorage.setItem('token', data.token);
      setUser(data.usuario);
      return data;
    } catch (err) {
      setError(err.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome, email, senha) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/usuario/registro', { nome, email, senha });
      localStorage.setItem('token', data.token);
      setUser(data.usuario);
      return data;
    } catch (err) {
      setError(err.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, error, login, register, logout };
}
