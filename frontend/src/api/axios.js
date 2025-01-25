// important note for myself:
// axios wraps response in a data wrapper so response.data will equal the response made in my controller. 

// import axios from axios library
import axios from 'axios';

// create instance of axios for use by other api service files
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000'
});

export default axiosInstance;