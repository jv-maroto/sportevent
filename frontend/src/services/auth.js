import api from './api';

export const register = async (data) => {
  const response = await api.post('/api/auth/register', data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post('/api/auth/login', data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/api/auth/me', data);
  return response.data;
};

export const changePassword = async (data) => {
  await api.put('/api/auth/me/password', data);
};
