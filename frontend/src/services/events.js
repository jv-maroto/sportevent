import api from './api';

export const getEvents = async (params = {}) => {
  const response = await api.get('/api/events/', { params });
  return response.data;
};

export const getMyEvents = async () => {
  const response = await api.get('/api/events/my');
  return response.data;
};

export const getEvent = async (id) => {
  const response = await api.get(`/api/events/${id}`);
  return response.data;
};

export const createEvent = async (data) => {
  const response = await api.post('/api/events/', data);
  return response.data;
};

export const updateEvent = async (id, data) => {
  const response = await api.put(`/api/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id) => {
  await api.delete(`/api/events/${id}`);
};

export const uploadEventImage = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/api/events/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
