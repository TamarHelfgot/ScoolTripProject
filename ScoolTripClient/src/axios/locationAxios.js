import axios from 'axios';

const url = 'https://localhost:7279/api/Locations/';

export const getLocations = (teacherId) =>
    axios.get(`${url}?teacherId=${teacherId}`);

export const getStudentLocation = (studentId) =>
    axios.get(`${url}student?studentId=${studentId}`);

export const getStudentStatus = (studentId) =>
    axios.get(`${url}mystatus?studentId=${studentId}`);
