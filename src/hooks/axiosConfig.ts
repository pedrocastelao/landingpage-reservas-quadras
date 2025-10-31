import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, // URL da sua API
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
