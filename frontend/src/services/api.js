import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir token JWT a cada peticion
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta: NO redirigir a login automaticamente.
// Cada componente maneja sus propios errores via try/catch.
// Si el token expira, ProtectedRoute se encarga al navegar.
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
