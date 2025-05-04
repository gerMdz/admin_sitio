import api from '@/api/axios'

export async function getMemberSocialMedias(verTodos = false) {
    const response = await api.get('/member-social-media', {
        params: verTodos ? {all: true} : {}
    })
    return response.data
}

export const getMemberSocialMediasByMember = (id) => {
    return api.get(`/member-social-media/${id}`);
};

export const createMemberSocialMedia = (payload) => {
    return api.post('/member-social-media', payload);
};

export const updateMemberSocialMedia = (id, payload) => {
    return api.put(`/member-social-media/${id}`, payload);
};

export const deleteMemberSocialMedia = (id) => {
    return api.delete(`/member-social-media/${id}`);
};
