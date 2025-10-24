import api from '@/api/axios'

// List categories with optional filters: { nombre, descripcion, activo }
export async function getCategories(filters = {}) {
  const params = {}
  if (filters.nombre !== undefined && filters.nombre !== null && filters.nombre !== '') {
    params.nombre = String(filters.nombre)
  }
  if (filters.descripcion !== undefined && filters.descripcion !== null && filters.descripcion !== '') {
    params.descripcion = String(filters.descripcion)
  }
  if (filters.activo !== undefined && filters.activo !== null && filters.activo !== '') {
    params.activo = String(filters.activo)
  }

  const response = await api.get('/categories', { params })
  return response.data
}

export const getCategory = (id) => api.get(`/categories/${id}`)

export const createCategory = (payload) => api.post('/categories', payload)

export const updateCategory = (id, payload) => api.put(`/categories/${id}`, payload)

export const deleteCategory = (id) => api.delete(`/categories/${id}`)
