import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/auth';
import toast from 'react-hot-toast';
import { UserPlus, ArrowRight, Shield, Users, AlertCircle, Check } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'participant',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'full_name':
        return value.trim().length < 2 ? 'Minimo 2 caracteres' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email no valido' : '';
      case 'password': {
        if (value.length < 8) return 'Minimo 8 caracteres';
        if (!/[A-Z]/.test(value)) return 'Debe incluir una mayuscula';
        if (!/\d/.test(value)) return 'Debe incluir un numero';
        return '';
      }
      default:
        return '';
    }
  };

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
    if (errors[name] !== undefined) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (name) => {
    setErrors({ ...errors, [name]: validateField(name, form[name]) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    ['full_name', 'email', 'password'].forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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

  const fieldStatus = (name) => {
    if (errors[name] === undefined) return null;
    if (errors[name]) return (
      <p className="flex items-center gap-1 text-red-400 text-xs mt-1 font-body">
        <AlertCircle className="w-3 h-3" />
        {errors[name]}
      </p>
    );
    return (
      <p className="flex items-center gap-1 text-emerald-400 text-xs mt-1 font-body">
        <Check className="w-3 h-3" />
        Correcto
      </p>
    );
  };

  // Indicadores de fuerza de contrasena
  const passwordChecks = [
    { label: '8+ caracteres', ok: form.password.length >= 8 },
    { label: '1 mayuscula', ok: /[A-Z]/.test(form.password) },
    { label: '1 numero', ok: /\d/.test(form.password) },
  ];

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
                onChange={(e) => handleChange('full_name', e.target.value)}
                onBlur={() => handleBlur('full_name')}
                className={`input-dark ${errors.full_name ? 'border-red-400/50' : errors.full_name === '' ? 'border-emerald-400/30' : ''}`}
                placeholder="Tu nombre"
              />
              {fieldStatus('full_name')}
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`input-dark ${errors.email ? 'border-red-400/50' : errors.email === '' ? 'border-emerald-400/30' : ''}`}
                placeholder="tu@email.com"
              />
              {fieldStatus('email')}
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                Contrasena
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`input-dark ${errors.password ? 'border-red-400/50' : errors.password === '' ? 'border-emerald-400/30' : ''}`}
                placeholder="Minimo 8 caracteres"
              />
              {form.password.length > 0 && (
                <div className="flex gap-3 mt-2">
                  {passwordChecks.map((check) => (
                    <span key={check.label} className={`text-[10px] font-body ${check.ok ? 'text-emerald-400' : 'text-smoke-500'}`}>
                      {check.ok ? <Check className="w-3 h-3 inline mr-0.5" /> : null}
                      {check.label}
                    </span>
                  ))}
                </div>
              )}
              {fieldStatus('password')}
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                Telefono <span className="text-smoke-500 normal-case">(opcional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
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
