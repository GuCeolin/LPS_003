import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3306',  // URL do seu back-end Spring Boot
});

export default api;
