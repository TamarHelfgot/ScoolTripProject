import axios from 'axios';

const url = 'https://localhost:7279/api/Class/';

export const getAllClasses = () =>
    axios.get(url);
