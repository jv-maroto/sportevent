import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-dark-500 border-t-lime-400 rounded-full animate-spin" />
          <span className="text-smoke-400 text-sm font-body">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
