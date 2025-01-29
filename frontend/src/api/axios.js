// Note for myself:
// axios wraps response in a data wrapper so response.data will equal the response made in my controller. 
// use const { data } = await axios blah blah blah to return my backend code without that data wrapper

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export default axios.create({
    baseURL: BASE_URL
});

// interceptors will be attached to axiosPrivate
export const axiosPrivate = axios.create({
    baseURL: BASE_URL, 
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});