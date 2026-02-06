import axios from "axios";

const API = axios.create({
  baseURL: "https://church-management-system-k7bt.onrender.com/api", // your deployed backend
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
