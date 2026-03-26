import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut, User, CalendarPlus, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-500/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(200,255,0,0.4)] transition-all duration-300">
              <Trophy className="w-4 h-4 text-dark-900" />
            </div>
            <span className="font-display font-bold text-lg text-smoke-100 tracking-tight">
              Sport<span className="text-lime-400">Event</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/events"
              className="px-4 py-2 text-sm text-smoke-300 hover:text-lime-400 transition-colors duration-300 font-medium"
            >
              Eventos
            </Link>

            {user ? (
              <>
                {user.role === 'organizer' && (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-1.5 px-4 py-2 text-sm text-smoke-300 hover:text-lime-400 transition-colors duration-300 font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Panel
                    </Link>
                    <Link
                      to="/events/create"
                      className="flex items-center gap-1.5 px-4 py-2 text-sm text-smoke-300 hover:text-lime-400 transition-colors duration-300 font-medium"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      Crear
                    </Link>
                  </>
                )}
                <Link
                  to="/my-inscriptions"
                  className="px-4 py-2 text-sm text-smoke-300 hover:text-lime-400 transition-colors duration-300 font-medium"
                >
                  Inscripciones
                </Link>

                <div className="w-px h-5 bg-dark-500 mx-2" />

                <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-full border border-dark-500">
                  <div className="w-5 h-5 bg-lime-400/20 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-lime-400" />
                  </div>
                  <span className="text-xs font-medium text-smoke-200 max-w-[100px] truncate">
                    {user.full_name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-smoke-400 hover:text-red-400 transition-colors duration-300 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-smoke-300 hover:text-lime-400 transition-colors duration-300 font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="ml-2 bg-lime-400 text-dark-900 px-5 py-2 rounded-lg text-sm font-display font-bold hover:bg-lime-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,255,0,0.3)]"
                >
                  Registro
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-smoke-300 hover:text-lime-400 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-dark-500/50 space-y-1 animate-fade-in">
            <Link to="/events" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-smoke-300 hover:text-lime-400 hover:bg-dark-700 rounded-lg transition-all">
              Eventos
            </Link>
            {user ? (
              <>
                {user.role === 'organizer' && (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-smoke-300 hover:text-lime-400 hover:bg-dark-700 rounded-lg transition-all">
                      Panel
                    </Link>
                    <Link to="/events/create" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-smoke-300 hover:text-lime-400 hover:bg-dark-700 rounded-lg transition-all">
                      Crear evento
                    </Link>
                  </>
                )}
                <Link to="/my-inscriptions" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-smoke-300 hover:text-lime-400 hover:bg-dark-700 rounded-lg transition-all">
                  Mis inscripciones
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 text-red-400 hover:bg-dark-700 rounded-lg transition-all cursor-pointer">
                  Cerrar sesion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-smoke-300 hover:text-lime-400 hover:bg-dark-700 rounded-lg transition-all">
                  Iniciar sesion
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-lime-400 font-bold hover:bg-dark-700 rounded-lg transition-all">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
