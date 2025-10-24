import axios from 'axios';

// Use relative base URL in development to leverage Vite dev proxy and avoid CORS
const baseURL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
  baseURL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
