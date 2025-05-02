import api from '@/api/axios.js';

export default {
    getMembers(search = '') {
        return api.get(`/combo/member?search=${encodeURIComponent(search)}`).then(res => res.data);
    },

    getExperiences(search = '') {
        return api.get(`/combo/experience?search=${encodeURIComponent(search)}`).then(res => res.data);
    },
    obtenerComboFamily(term = '') {
        const res = api.get('/combo/family', {params: {q: term}})
        return res.data
    }

};
