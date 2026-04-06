import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/auth';
import { getMyInscriptions } from '../services/inscriptions';
import { formatDateShort } from '../utils/formatDate';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Trophy, Calendar, Check, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('profile');
  const [inscriptions, setInscriptions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getMyInscriptions();
      setInscriptions(data);
    } catch {
      // silenciar errores si el usuario no tiene inscripciones
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateProfile(form);
      const token = localStorage.getItem('token');
      loginUser(token, updated);
      toast.success('Perfil actualizado');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword(passwordForm);
      toast.success('Contrasena cambiada');
      setPasswordForm({ current_password: '', new_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al cambiar contrasena');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: <User className="w-4 h-4" /> },
    { id: 'password', label: 'Contrasena', icon: <Lock className="w-4 h-4" /> },
    { id: 'history', label: 'Historial', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="grain-overlay" />
      <div className="fixed inset-0 bg-grid opacity-20" />

      <div className="relative max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 opacity-0 animate-fade-up">
          <div className="w-14 h-14 bg-lime-400/10 border border-lime-400/20 rounded-xl flex items-center justify-center">
            <User className="w-7 h-7 text-lime-400" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-3xl text-smoke-100">Mi perfil</h1>
            <p className="text-smoke-500 text-sm font-body">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-dark-800 border border-dark-500/50 rounded-xl p-1 opacity-0 animate-fade-up stagger-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tab === t.id
                  ? 'bg-lime-400 text-dark-900'
                  : 'text-smoke-400 hover:text-smoke-200'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="opacity-0 animate-fade-up stagger-2">
          {tab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="bg-dark-800 border border-dark-500/50 rounded-2xl p-8 space-y-6">
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
                />
              </div>
              <div>
                <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                  Telefono
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-dark"
                  placeholder="600 123 456"
                />
              </div>
              <div className="pt-2 flex items-center gap-3 text-xs text-smoke-500 font-body">
                <Calendar className="w-3.5 h-3.5" />
                Miembro desde {user?.created_at ? formatDateShort(user.created_at) : '-'}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin mx-auto" />
                ) : 'Guardar cambios'}
              </button>
            </form>
          )}

          {tab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="bg-dark-800 border border-dark-500/50 rounded-2xl p-8 space-y-6">
              <div>
                <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                  Contrasena actual
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                  Nueva contrasena
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  className="input-dark"
                  placeholder="Minimo 8 caracteres, 1 mayuscula, 1 numero"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin mx-auto" />
                ) : 'Cambiar contrasena'}
              </button>
            </form>
          )}

          {tab === 'history' && (
            <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-8">
              <h3 className="font-display font-bold text-smoke-100 mb-6">Historial de inscripciones</h3>
              {loadingHistory ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-dark-500 border-t-lime-400 rounded-full animate-spin" />
                </div>
              ) : inscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-8 h-8 text-dark-400 mx-auto mb-3" />
                  <p className="text-smoke-500 text-sm font-body">No tienes inscripciones aun</p>
                  <Link to="/events" className="text-lime-400 text-sm hover:underline mt-2 inline-block">
                    Explorar eventos
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {inscriptions.map((insc) => (
                    <Link
                      key={insc.id}
                      to={`/events/${insc.event_id}`}
                      className="flex items-center justify-between p-4 bg-dark-700 rounded-xl hover:bg-dark-600 transition-all"
                    >
                      <div>
                        <p className="text-sm font-display font-bold text-smoke-100">{insc.event_title}</p>
                        <p className="text-xs text-smoke-500 font-body mt-0.5">{formatDateShort(insc.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-smoke-300 font-body">{insc.amount_paid.toFixed(2)} EUR</span>
                        <span className={`text-[10px] font-display font-bold uppercase px-2 py-0.5 rounded-full ${
                          insc.status === 'confirmed' ? 'badge-confirmed' : insc.status === 'cancelled' ? 'badge-cancelled' : 'badge-pending'
                        }`}>
                          {insc.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
