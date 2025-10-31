import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // URL da sua API
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
