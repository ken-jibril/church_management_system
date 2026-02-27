/**
 * Members Service
 * Wraps all /members/ and /activities/new-members/ API calls.
 *
 * Backend endpoints:
 *   GET    /members/all/           → list all members
 *   POST   /members/all/           → create member
 *   GET    /members/all/{id}/      → retrieve member
 *   PUT    /members/all/{id}/      → update member
 *   PATCH  /members/all/{id}/      → partial update
 *   DELETE /members/all/{id}/      → delete member (super admin only)
 *
 *   GET    /activities/new-members/           → list pending registrations
 *   POST   /activities/new-members/           → submit new registration
 *   POST   /activities/new-members/{id}/approve/
 *   POST   /activities/new-members/{id}/reject/
 *
 * Backend Member fields:
 *   id, username, first_name, last_name, email, phone_number,
 *   district, is_super_admin, is_parish_minister, is_kirk_session,
 *   can_approve_pending, is_active, date_joined, created_at
 */
import api from "../api/axios";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Map backend Member → frontend display shape.
 * The frontend uses a flat `name` field and `phone` instead of `phone_number`.
 */
export const normaliseMember = (raw) => ({
  id: raw.id,
  name: `${raw.first_name || ""} ${raw.last_name || ""}`.trim() || raw.username,
  username: raw.username,
  email: raw.email || "",
  phone: raw.phone_number || "",
  role: deriveRole(raw),
  status: raw.is_active !== false ? "active" : "inactive",
  joinDate: raw.date_joined
    ? raw.date_joined.split("T")[0]
    : raw.created_at
      ? raw.created_at.split("T")[0]
      : "",
  district: raw.district || null,
  // keep raw flags
  is_super_admin: raw.is_super_admin,
  is_parish_minister: raw.is_parish_minister,
  is_kirk_session: raw.is_kirk_session,
  can_approve_pending: raw.can_approve_pending,
  // fields not in backend — keep empty for UI compatibility
  address: raw.address || "",
  gender: raw.gender || "",
  dob: raw.dob || "",
  baptized: raw.baptized || false,
  group: raw.group || "",
});

const deriveRole = (raw) => {
  if (raw.is_super_admin || raw.is_superuser) return "superadmin";
  if (raw.is_parish_minister) return "pastor";
  if (raw.is_kirk_session) return "elder";
  return "member";
};

// ── CRUD ─────────────────────────────────────────────────────────────────────

export const getMembers = async () => {
  const res = await api.get("/members/all/");
  const data = Array.isArray(res.data) ? res.data : res.data.results || [];
  return data.map(normaliseMember);
};

export const getMember = async (id) => {
  const res = await api.get(`/members/all/${id}/`);
  return normaliseMember(res.data);
};

export const createMember = async (payload) => {
  const res = await api.post("/members/all/", payload);
  return normaliseMember(res.data);
};

export const updateMember = async (id, payload) => {
  const res = await api.patch(`/members/all/${id}/`, payload);
  return normaliseMember(res.data);
};

export const deleteMember = async (id) => {
  await api.delete(`/members/all/${id}/`);
};

// ── Pending Registrations ─────────────────────────────────────────────────────

export const getPendingRegistrations = async () => {
  const res = await api.get("/activities/new-members/");
  const data = Array.isArray(res.data) ? res.data : res.data.results || [];
  return data;
};

export const approveRegistration = async (id) => {
  const res = await api.post(`/activities/new-members/${id}/approve/`);
  return res.data;
};

export const rejectRegistration = async (id) => {
  const res = await api.post(`/activities/new-members/${id}/reject/`);
  return res.data;
};
