import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getCurrentUser } from "../services/authService.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    // assuming backend returns access token
    localStorage.setItem("accessToken", data.access);
    setUser(data.user || null);

    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
