// important note for myself:
// axios wraps response in a data wrapper so response.data will equal the response i made in my controller. 
// response.data.data equals the data object inside my controller

import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const loginAPI = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);

    const { token, data: user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('username', user.username); 

    return response.data;
  } catch (err) {
    console.error('Login failed: ', err);
    throw err;
  }
};