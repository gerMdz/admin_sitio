import api from '@/api/axios.js'

export async function eliminarMemberInterest(id) {
    return api.delete(`/member-interest/${id}`)
}

export async function actualizarMemberInterest(id, data) {
    const response = await api.put(`/member-interest/${id}`, data)
    return response.data
}

export async function listarMemberInterests(verTodos = false) {
    const response = await api.get('/member-interest', {
        params: verTodos ? {all: true} : {}
    })
    return response.data
}