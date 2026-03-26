import api from './api';

export const getEventRanking = async (eventId) => {
  const response = await api.get(`/api/results/event/${eventId}`);
  return response.data;
};

export const createResult = async (data) => {
  const response = await api.post('/api/results/', data);
  return response.data;
};

export const updateResult = async (id, data) => {
  const response = await api.put(`/api/results/${id}`, data);
  return response.data;
};
