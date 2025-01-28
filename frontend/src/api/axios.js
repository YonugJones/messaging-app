// important note for myself:
// axios wraps response in a data wrapper so response.data will equal the response made in my controller. 

// import axios from axios library
import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

export const createAxiosInstance = (options = {}) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
};

export const axiosPublic = createAxiosInstance({
  withCredentials: false
});

export const axiosPrivate = createAxiosInstance({
  withCredentials: true
});