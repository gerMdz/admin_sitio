import api from '@/api/axios'

export async function getMemberVoluntaries(verTodos = false) {
    const response = await api.get('/member-voluntary', {
        params: verTodos ? {all: true} : {}
    })
    return response.data
}

export const getMemberVoluntariesByMember = (id) => {
    return api.get(`/member-voluntary/${id}`);
};

export const createMemberVoluntary = (payload) => {
    return api.post('/member-voluntary', payload);
};

export const updateMemberVoluntary = (id, payload) => {
    return api.put(`/member-voluntary/${id}`, payload);
};

export const deleteMemberVoluntary = (id) => {
    return api.delete(`/member-voluntary/${id}`);
};
