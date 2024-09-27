import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.16:8181/cxf/',
});

export default api;
