import api from "../api/axios";

export const loginUser = async (data) => {
  // Django JWT expects username, not email - convert if needed
  const payload = {
    username: data.email || data.username, // Use email as username if email provided
    password: data.password,
  };
  console.log("Login payload:", payload);
  try {
    const response = await api.post("/auth/login/", payload);
    return response.data;
  } catch (error) {
    console.error("Login error details:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (data) => {
  console.log("Registration payload:", data);
  try {
    const response = await api.post("/auth/register/", data);
    return response.data;
  } catch (error) {
    console.error("Registration error details:", error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me/");
  return response.data;
};
