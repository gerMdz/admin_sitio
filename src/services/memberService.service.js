import api from '@/api/axios'

export async function getMemberServices(verTodos = false) {
    const response = await api.get('/member-service', {
        params: verTodos ? {all: true} : {}
    })
    return response.data
}

export const getMemberServicesByMember = (id) => {
    return api.get(`/member-service/${id}`);
};

export const createMemberService = (payload) => {
    return api.post('/member-service', payload);
};

export const updateMemberService = (id, payload) => {
    return api.put(`/member-service/${id}`, payload);
};

export const deleteMemberService = (id) => {
    return api.delete(`/member-service/${id}`);
};
