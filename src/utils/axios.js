import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://survico-backend-production.up.railway.app" ||
    "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
