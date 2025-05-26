import api from '@/api/axios';

export async function getDashboardData() {
  const response = await api.get('/dashboard');
  return response.data;
}

export async function getMembersByCivilState() {
  const response = await api.get('/dashboard/miembros_por_estado_civil');
  return response.data;
}
