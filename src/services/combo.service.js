import api from '@/api/axios.js';

export async function getComboMembers(q = '') {
    const response = await api.get(`/combo/member`, {
        params: {q}
    })

    // Transformamos aquí si backend no devuelve `label`
    return response.data.map(m => ({
        id: m.id,
        label: `${m.label}`
    }))
}


export async function getComboExperiences(search = '') {
    const response = await api.get(`/combo/experience`, {
        params: {search}
    });
    return response.data;
}

export async function getComboInterests(q = '') {
    const response = await api.get('/combo/interest', {params: {q}})

    return response.data.map(i => ({
        id: i.id,
        nombre: {name: i.label} // esto es clave
    }))
}

export async function getComboLifeStages(q = '') {
    const response = await api.get('/combo/life-stage', {params: {q}});
    return response.data.map(i => ({
        id: i.id,
        label: i.label // ← ya es plano
    }));
}


export async function getComboFamilies(search = '') {
    const response = await api.get(`/combo/family`, {
        params: {q: search}
    });
    return response.data;
}
