
import api from '@/api/axios';

export async function getMemberNeeds (verTodos = false) {
    const response = await api.get('/member-need', {
        params: verTodos ? {all: true} : {}
    })
    return response.data
}

export const getMemberNeedsByMember = (id) => {
    return api.get(`/member-need/member/${id}`);
};

export const createMemberNeed = (payload) => {
    return api.post('/member-need', payload);
};

export const updateMemberNeed = (id, payload) => {
    return api.put(`/member-need/${id}`, payload);
};

export const deleteMemberNeed = (id) => {
    return api.delete(`/member-need/${id}`);
};