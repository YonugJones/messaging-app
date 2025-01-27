// important note for myself:
// axios wraps response in a data wrapper so response.data will equal the response made in my controller. 

// import axios from axios library
import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

// create instance of axios for use by other api service files
export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
