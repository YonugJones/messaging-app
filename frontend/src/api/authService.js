// important note for myself:
// axios wraps response in a data wrapper so response.data will equal the response made in my controller. 

import axios from './axios';

const SIGNUP_URL = '/auth/signup';
const LOGIN_URL = '/auth/login';

export const signup = async (username, password, confirmPassword) => {
  const response = await axios.post(
    SIGNUP_URL,
    JSON.stringify({ username, password, confirmPassword }),
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
  );
  return response.data;
};


export const login = async(username, password) => {
  const response = await axios.post(
    LOGIN_URL,
    JSON.stringify({ username, password }),
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
  );
  return response.data;
}