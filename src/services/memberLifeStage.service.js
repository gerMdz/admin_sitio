
import api from '@/api/axios';

export async function getMemberLifeStages (verTodos = false) {
    const response = await api.get('/member-life-stages', {
        params: verTodos ? {all: true} : {}
    })
    return response.data
}

export const getMemberLifeStagesByMember = (id) => {
    return api.get(`/member-life-stages/member/${id}`);
};

export const createMemberLifeStage = (payload) => {
    return api.post('/member-life-stages', payload);
};

export const updateMemberLifeStage = (id, payload) => {
    return api.put(`/member-life-stages/${id}`, payload);
};

export const deleteMemberLifeStage = (id) => {
    return api.delete(`/member-life-stages/${id}`);
};