import api from '@/api/axios'

export async function getCivilStates(verTodos = false) {
    const response = await api.get('/civil_states', {
        params: verTodos ? {all: true} : {}
    })
    return response.data
}

export const getCivilState = (id) => {
    return api.get(`/civil_states/${id}`);
};

export const createCivilState = (payload) => {
    return api.post('/civil_states', payload);
};

export const updateCivilState = (id, payload) => {
    return api.put(`/civil_states/${id}`, payload);
};

export const deleteCivilState = (id, payload) => {
    return api.delete(`/civil_states/${id}`, { data: payload });
};
