import axios from 'axios';

const url = 'https://localhost:7279/api/Users/';

export const loginUser = (id) =>
    axios.post(`${url}login?id=${id}`);

export const getAllUsers = (requesterId) =>
    axios.get(`${url}?requesterId=${requesterId}`);

export const addUser = (newUser, requesterId) =>
    axios.post(`${url}?requesterId=${requesterId}`, newUser);

export const getMyStudents = (teacherId) =>
    axios.get(`${url}mystudents?teacherId=${teacherId}`);
