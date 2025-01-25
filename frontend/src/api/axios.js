// important note for myself:
// axios wraps response in a data wrapper so response.data will equal the response i made in my controller. 
// response.data.data equals the data object inside my controller

import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3000'
});