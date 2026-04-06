import api from './api';

export const createCheckout = async (eventId) => {
  const response = await api.post(`/api/inscriptions/checkout/${eventId}`);
  return response.data;
};

export const getMyInscriptions = async () => {
  const response = await api.get('/api/inscriptions/my');
  return response.data;
};

export const getEventInscriptions = async (eventId) => {
  const response = await api.get(`/api/inscriptions/event/${eventId}`);
  return response.data;
};

export const cancelInscription = async (inscriptionId) => {
  await api.delete(`/api/inscriptions/${inscriptionId}`);
};

export const exportInscriptionsCSV = (eventId) => {
  const token = localStorage.getItem('token');
  const baseURL = api.defaults.baseURL || '';
  window.open(`${baseURL}/api/inscriptions/event/${eventId}/csv?token=${token}`, '_blank');
};
