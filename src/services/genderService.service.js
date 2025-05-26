import api from '@/api/axios'

export async function getGenders(verTodos = false) {
    const response = await api.get('/gender', {
        params: verTodos ? {all: true} : {}
    })
    return response.data
}

export const getGender = (id) => {
    return api.get(`/gender/${id}`);
};

export const createGender = (payload) => {
    return api.post('/gender', payload);
};

export const updateGender = (id, payload) => {
    return api.put(`/gender/${id}`, payload);
};

export const deleteGender = (id, payload) => {
    return api.delete(`/gender/${id}`, { data: payload });
};
