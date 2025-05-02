import api from '@/api/axios'

export async function obtenerTodo() {
    const res = await api.get('/member-family')
    return res.data
}

export async function eliminarRelacion(id) {
    await api.delete(`/member-family/${id}`)
}

export async function crearRelacion(data) {
    const res = await api.post('/member-family', data)
    return res.data
}

export async function actualizarRelacion(data) {
    const res = await api.put(`/member-family/${data.id}`, data)
    return res.data
}

export async function obtenerComboMember(term = '') {
    const res = await api.get('/combo/member', { params: { q: term } })
    return res.data
}
