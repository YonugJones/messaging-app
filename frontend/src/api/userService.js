import { axiosPrivate } from './axios';

const USERS_URL = '/users';

export const getUsers = async (axiosInstance, signal) => {
  const response = await axiosPrivate.get(USERS_URL, { signal });
  return response.data;
}