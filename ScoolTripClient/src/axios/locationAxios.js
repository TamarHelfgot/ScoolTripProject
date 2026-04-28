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

export const getLocations = () =>
    instance.get('/Locations');

export const getStudentLocation = () =>
    instance.get('/Locations/student');

export const getStudentStatus = () =>
    instance.get('/Locations/mystatus');