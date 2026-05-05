import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password);
        toast.success('Cadastro realizado! Faça login');
        setIsRegister(false);
      } else {
        await login(email, password);
        toast.success('Login realizado!');
        navigate('/');
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-8">🎉 Brinquedos</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold mb-2">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Seu nome"
                required={isRegister}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Carregando...' : isRegister ? 'Cadastrar' : 'Login'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="text-blue-600 hover:underline"
          >
            {isRegister
              ? 'Já tem conta? Faça login'
              : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
