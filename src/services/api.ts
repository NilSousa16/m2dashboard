import axios from 'axios';

const api = axios.create({
  baseURL: 'http://18.223.171.40:8181/cxf/',
});

export default api;
