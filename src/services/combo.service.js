import api from '@/api/axios.js';

export async function getComboMembers(q = '', page = 1) {
  const response = await api.get('/combo/member', {
    params: {q, page}
  });

  return response.data.map(m => ({
    id: m.id,
    label: m.label
  }));
}


export async function getComboExperiences(q = '') {
  const response = await api.get('/combo/experience', {params: {q}});
  return response.data;
}

export async function getComboInterests(q = '') {
  const response = await api.get('/combo/interest', {params: {q}});
  return response.data.map(i => ({
    id: i.id,
    nombre: i.label
  }));
}

export async function getComboLifeStages(q = '') {
  const response = await api.get('/combo/life-stage', {params: {q}});
  return response.data.map(i => ({
    id: i.id,
    label: i.label
  }));
}

export async function getComboNeeds(q = '', page = 1) {
  const response = await api.get('/combo/need', {
    params: {q, page}
  });

  return response.data.map(i => ({
    id: i.id,
    label: i.label
  }));
}


export async function getComboFamilies(q = '') {
  const response = await api.get('/combo/family', {params: {q}});
  return response.data;
}

export async function getComboServices(q = '', page = 1) {
  const response = await api.get('/combo/service', {
    params: {q, page}
  });

  return response.data.map(i => ({
    id: i.id,
    label: i.label
  }));
}

export async function getComboSocialMedias(q = '', page = 1) {
  const response = await api.get('/combo/social-media', {
    params: {q, page}
  });

  return response.data.map(i => ({
    id: i.id,
    label: i.label
  }));
}


