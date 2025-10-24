import api from '@/api/axios.js';

export function getApiLogs() {
  return api.get('/logs');
}
