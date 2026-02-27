/**
 * Users Service
 * The UserManagement page manages system users (Members with login access).
 * This wraps the same /members/all/ endpoint used by membersService,
 * but returns the raw backend shape with role flags for admin use.
 *
 * Backend endpoints:
 *   GET    /members/all/           → list all members/users
 *   POST   /members/all/           → create user
 *   PATCH  /members/all/{id}/      → update user (role flags, is_active, etc.)
 *   DELETE /members/all/{id}/      → delete user (super admin only)
 */
import api from "../api/axios";

const deriveRole = (raw) => {
  if (raw.is_super_admin || raw.is_superuser) return "superadmin";
  if (raw.is_parish_minister) return "pastor";
  if (raw.is_kirk_session) return "elder";
  return "member";
};

export const normaliseUser = (raw) => ({
  id: raw.id,
  name: `${raw.first_name || ""} ${raw.last_name || ""}`.trim() || raw.username,
  username: raw.username,
  email: raw.email || "",
  role: deriveRole(raw),
  status: raw.is_active !== false ? "active" : "inactive",
  lastLogin: raw.last_login ? raw.last_login.split("T")[0] : null,
  createdAt: raw.date_joined
    ? raw.date_joined.split("T")[0]
    : raw.created_at
      ? raw.created_at.split("T")[0]
      : "",
  avatar: null,
  // raw flags for editing
  is_super_admin: raw.is_super_admin,
  is_parish_minister: raw.is_parish_minister,
  is_kirk_session: raw.is_kirk_session,
  is_active: raw.is_active,
  can_approve_pending: raw.can_approve_pending,
});

export const getUsers = async () => {
  const res = await api.get("/members/all/");
  const data = Array.isArray(res.data) ? res.data : res.data.results || [];
  return data.map(normaliseUser);
};

export const createUser = async (payload) => {
  const res = await api.post("/members/all/", payload);
  return normaliseUser(res.data);
};

export const updateUser = async (id, payload) => {
  const res = await api.patch(`/members/all/${id}/`, payload);
  return normaliseUser(res.data);
};

export const deleteUser = async (id) => {
  await api.delete(`/members/all/${id}/`);
};
