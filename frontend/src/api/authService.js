// important note for myself:
// axios wraps response in a data wrapper so response.data will equal the response made in my controller. 

import { axiosPublic } from './axios';

const AUTH_URLS = {
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
};

export const signup = async (credentials) => {
  const { data } = await axiosPublic.post(AUTH_URLS.SIGNUP, credentials);
  return data;
};

export const login = async (credentials) => {
  const { data } = await axiosPublic.post(AUTH_URLS.LOGIN, credentials);
  return data;
};