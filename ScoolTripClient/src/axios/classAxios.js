import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://localhost:7279/api',
    withCredentials: true
});

instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getAllClasses = () =>
    instance.get('/Class');

export const addClass = (className) =>
    instance.post('/Class', { className });