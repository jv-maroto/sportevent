import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Monitorizar expiracion del JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const now = Date.now();
    const timeUntilExpiry = expiry - now;

    if (timeUntilExpiry <= 0) {
      toast.error('Tu sesion ha expirado. Inicia sesion de nuevo.');
      logout();
      return;
    }

    // Avisar 5 minutos antes de que expire
    const warningTime = timeUntilExpiry - 5 * 60 * 1000;
    let warningTimer;
    if (warningTime > 0) {
      warningTimer = setTimeout(() => {
        toast('Tu sesion expira en 5 minutos', { icon: '\u23F0' });
      }, warningTime);
    }

    // Cerrar sesion al expirar
    const expiryTimer = setTimeout(() => {
      toast.error('Tu sesion ha expirado. Inicia sesion de nuevo.');
      logout();
    }, timeUntilExpiry);

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      clearTimeout(expiryTimer);
    };
  }, [user, logout]);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
