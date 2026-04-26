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

export const getLocations = (teacherId) =>
    instance.get(`/Locations?teacherId=${teacherId}`);

export const getStudentLocation = (studentId) =>
    instance.get(`/Locations/student?studentId=${studentId}`);

export const getStudentStatus = (studentId) =>
    instance.get(`/Locations/mystatus?studentId=${studentId}`);