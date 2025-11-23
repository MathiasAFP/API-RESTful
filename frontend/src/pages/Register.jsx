import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Register({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', confirmSenha: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome || formData.nome.trim().length === 0) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email || formData.email.trim().length === 0) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha || formData.senha.length === 0) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 3) {
      newErrors.senha = 'Senha deve ter pelo menos 3 caracteres';
    }

    if (!formData.confirmSenha || formData.confirmSenha.length === 0) {
      newErrors.confirmSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmSenha) {
      newErrors.confirmSenha = 'As senhas não correspondem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setErrors({});

    try {
      const data = await api.post('/usuario/registro', {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha
      });
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      if (err.status === 400 && err.data?.message) {
        setError(err.data.message);
      } else {
        setError('Erro ao registrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Registrar</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value });
                if (errors.nome) setErrors({ ...errors, nome: '' });
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.nome ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Seu nome"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="seu@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => {
                setFormData({ ...formData, senha: e.target.value });
                if (errors.senha) setErrors({ ...errors, senha: '' });
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.senha ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Sua senha"
            />
            {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input
              type="password"
              value={formData.confirmSenha}
              onChange={(e) => {
                setFormData({ ...formData, confirmSenha: e.target.value });
                if (errors.confirmSenha) setErrors({ ...errors, confirmSenha: '' });
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.confirmSenha ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Confirme sua senha"
            />
            {errors.confirmSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmSenha}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition disabled:bg-blue-300"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Já tem conta? <Link to="/login" className="text-blue-500 hover:underline">Faça login</Link>
        </p>
      </div>
    </div>
  );
}
