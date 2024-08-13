import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
});

const token = localStorage.getItem('token');
if (token) {
    api.defaults.headers.common['Authorization'] = token;
}

export default api;
