import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://127.0.0.1:8000/api', // O tu base real
});

// Interceptor para meter el token en cada request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // o sacarlo de Vuex si querés más pro
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
