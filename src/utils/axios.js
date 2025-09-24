import axios from "axios";

const api = axios.create({
  baseURL: "https://survico-backend-production.up.railway.app",
});

export default api;
