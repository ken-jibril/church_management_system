import api from "../api/axios";

export const loginUser = async (data) => {
  // Django JWT expects username, not email - convert if needed
  const payload = {
    username: data.email || data.username, // Use email as username if email provided
    password: data.password,
  };
  console.log("Login payload:", payload);
  console.log("Login endpoint: /auth/login/");
  try {
    const response = await api.post("/auth/login/", payload);
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error details:", error.response?.data || error.message);
    console.error("Login full error:", error);
    throw error;
  }
};

export const registerUser = async (data) => {
  console.log("Registration payload:", data);
  console.log("Registration endpoint: /auth/register/");
  
  // Debug: Check what fields are being sent
  console.log("Username field:", data.username);
  console.log("Email field:", data.email);
  console.log("Password field present:", !!data.password);
  
  try {
    const response = await api.post("/auth/register/", data);
    console.log("Registration response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration error details:", error.response?.data || error.message);
    console.error("Registration full error:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me/");
  return response.data;
};
