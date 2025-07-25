// src/utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your backend URL
  withCredentials: true, // if you're using cookies or sessions
});

export default api;
