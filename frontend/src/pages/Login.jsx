import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/auth';
import toast from 'react-hot-toast';
import { Zap, ArrowRight } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      loginUser(data.access_token, data.user);
      toast.success('Sesion iniciada');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 pt-16">
      <div className="grain-overlay" />

      {/* Background grid */}
      <div className="fixed inset-0 bg-grid opacity-30" />

      <div className="relative w-full max-w-md opacity-0 animate-fade-up">
        {/* Card */}
        <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-8 relative overflow-hidden">
          {/* Glow effect top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-lime-400/10 border border-lime-400/20 rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-lime-400" />
            </div>
          </div>

          <h1 className="font-display font-extrabold text-2xl text-center text-smoke-100 mb-1">
            Bienvenido
          </h1>
          <p className="text-center text-smoke-500 text-sm font-body mb-8">
            Inicia sesion en tu cuenta
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-dark"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-dark"
                placeholder="Tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-smoke-500 mt-8 font-body">
            No tienes cuenta?{' '}
            <Link to="/register" className="text-lime-400 hover:underline font-medium">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
