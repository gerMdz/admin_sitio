import api from '@/api/axios.js'; // usa tu instancia de axios configurada

const endpoint = '/needs';

export default {
    listar() {
        return api.get(endpoint);
    },
    crear(payload) {
        return api.post(endpoint, payload);
    },
    actualizar(id, payload) {
        return api.put(`${endpoint}/${id}`, payload);
    },
    eliminar(id, payload) {
        return api.delete(`${endpoint}/${id}`, { data: payload });
    },
};
