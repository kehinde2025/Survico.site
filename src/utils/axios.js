// utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // change to your server URL
});

export default api;
