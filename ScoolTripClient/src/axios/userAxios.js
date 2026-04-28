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

export const getAllUsers = () =>
    instance.get('/Users');

export const addUser = (newUser) =>
    instance.post('/Users', newUser);

export const getMyStudents = () =>
    instance.get('/Users/mystudents');

export const getSession = () =>
    instance.get('/Users/session');

export const logoutUser = () =>
    instance.post('/Users/logout');