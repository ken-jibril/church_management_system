/**
 * AuthContext - Covenant Cloud Church Management System
 * Handles authentication and user session management via JWT
 */
import { createContext, useContext, useEffect, useState } from "react";
import { hasPermission } from "./RBACContext";
import { loginUser, getCurrentUser } from "../services/authService";

const AuthContext = createContext();

/**
 * Map backend Member fields → frontend role string used by RBAC.
 * Backend provides role field directly now, but we keep this as fallback.
 * Backend flags: is_super_admin, is_parish_minister, is_kirk_session
 * Frontend roles: superadmin | pastor | elder | member
 */
const deriveRole = (member) => {
  // Prefer backend-computed role if available
  if (member.role) return member.role;

  // Fallback to deriving from flags
  if (member.is_super_admin || member.is_superuser) return "superadmin";
  if (member.is_parish_minister) return "pastor";
  if (member.is_kirk_session) return "elder";
  return "member";
};

/**
 * Normalise a raw backend Member object into the shape the frontend expects.
 */
const normaliseMember = (raw) => ({
  id: raw.id,
  name: `${raw.first_name} ${raw.last_name}`.trim() || raw.username,
  email: raw.email,
  username: raw.username,
  phone: raw.phone_number || "",
  role: deriveRole(raw), // Use deriveRole which now prefers backend-computed role
  // keep raw flags for fine-grained checks
  is_super_admin: raw.is_super_admin,
  is_parish_minister: raw.is_parish_minister,
  is_kirk_session: raw.is_kirk_session,
  can_approve_pending: raw.can_approve_pending,
  district: raw.district,
  avatar: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start: restore session from localStorage tokens
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setLoading(false);
          return;
        }
        // Fetch current user from /auth/me/ (interceptor attaches token)
        const raw = await getCurrentUser();
        setUser(normaliseMember(raw));
      } catch {
        // Token invalid / expired — clear everything
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("covenantcloud_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (credentials) => {
    // POST /auth/login/ → { access, refresh }
    const tokenData = await loginUser(credentials);
    localStorage.setItem("accessToken", tokenData.access);
    localStorage.setItem("refreshToken", tokenData.refresh);

    // Fetch full user profile
    const raw = await getCurrentUser();
    const normalised = normaliseMember(raw);
    localStorage.setItem("covenantcloud_user", JSON.stringify(normalised));
    setUser(normalised);
    return normalised;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("covenantcloud_user");
    setUser(null);
  };

  // Check if current user has permission for an action on a module
  const can = (module, action) => {
    if (!user) return false;
    return hasPermission(user.role, module, action);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        can,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
