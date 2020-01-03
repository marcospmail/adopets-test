import axios from 'axios';

const api = axios.create({
  baseURL: 'https://test.adopets.app/v1',
  timeout: 10000,
});

export default api;
