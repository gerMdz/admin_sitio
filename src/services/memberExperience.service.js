import api from '@/api/axios.js';

export default {
    getAll() {
        return api.get('/member-experience');
    },

    getByMember(memberId) {
        return api.get(`/member-experience/member/${memberId}`);
    },

    create(payload) {
        return api.post('/member-experience', payload);
    },

    update(id, payload) {
        return api.put(`/member-experience/${id}`, payload);
    },

    remove(id) {
        return api.delete(`/member-experience/${id}`);
    }
};
