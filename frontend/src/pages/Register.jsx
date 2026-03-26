import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/auth';
import toast from 'react-hot-toast';
import { UserPlus, ArrowRight, Shield, Users } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'participant',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(form);
      loginUser(data.access_token, data.user);
      toast.success('Cuenta creada correctamente');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 pt-20 pb-10">
      <div className="grain-overlay" />
      <div className="fixed inset-0 bg-grid opacity-30" />

      <div className="relative w-full max-w-md opacity-0 animate-fade-up">
        <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />

          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-lime-400/10 border border-lime-400/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-7 h-7 text-lime-400" />
            </div>
          </div>

          <h1 className="font-display font-extrabold text-2xl text-center text-smoke-100 mb-1">
            Crear cuenta
          </h1>
          <p className="text-center text-smoke-500 text-sm font-body mb-8">
            Unete a la comunidad deportiva
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="input-dark"
                placeholder="Tu nombre"
              />
            </div>

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
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-dark"
                placeholder="Minimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                Telefono <span className="text-smoke-500 normal-case">(opcional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-dark"
                placeholder="600 123 456"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-3">
                Tipo de cuenta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'participant' })}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    form.role === 'participant'
                      ? 'border-lime-400/50 bg-lime-400/5'
                      : 'border-dark-500 bg-dark-700 hover:border-dark-400'
                  }`}
                >
                  <Users className={`w-5 h-5 mb-2 ${form.role === 'participant' ? 'text-lime-400' : 'text-smoke-500'}`} />
                  <div className={`text-sm font-display font-bold ${form.role === 'participant' ? 'text-lime-400' : 'text-smoke-300'}`}>
                    Participante
                  </div>
                  <div className="text-[10px] text-smoke-500 mt-0.5">Inscribete en eventos</div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'organizer' })}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    form.role === 'organizer'
                      ? 'border-lime-400/50 bg-lime-400/5'
                      : 'border-dark-500 bg-dark-700 hover:border-dark-400'
                  }`}
                >
                  <Shield className={`w-5 h-5 mb-2 ${form.role === 'organizer' ? 'text-lime-400' : 'text-smoke-500'}`} />
                  <div className={`text-sm font-display font-bold ${form.role === 'organizer' ? 'text-lime-400' : 'text-smoke-300'}`}>
                    Organizador
                  </div>
                  <div className="text-[10px] text-smoke-500 mt-0.5">Crea y gestiona eventos</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-smoke-500 mt-8 font-body">
            Ya tienes cuenta?{' '}
            <Link to="/login" className="text-lime-400 hover:underline font-medium">
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
