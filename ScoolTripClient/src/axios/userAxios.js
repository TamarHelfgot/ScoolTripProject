import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://localhost:7279/api',
    withCredentials: true
});
//TOKEN 
instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginUser = (id) =>
    instance.post(`/Users/login?id=${id}`);

export const getAllUsers = (requesterId) =>
    instance.get(`/Users?requesterId=${requesterId}`);

export const addUser = (newUser, requesterId) =>
    instance.post(`/Users?requesterId=${requesterId}`, newUser);

export const getMyStudents = (teacherId) =>
    instance.get(`/Users/mystudents?teacherId=${teacherId}`);

export const getSession = () =>
    instance.get('/Users/session');

export const logoutUser = () =>
    instance.post('/Users/logout');