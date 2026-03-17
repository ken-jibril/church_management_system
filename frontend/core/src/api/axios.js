import axios from "axios";

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token automatically on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh access token on 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh/`,
          { refresh: refreshToken }
        );
        const newAccess = res.data.access;
        localStorage.setItem("accessToken", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("covenantcloud_user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
