/**
 * Members Management Page - Covenant Cloud Church Management System
 * Uses real backend API via membersService.
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../services/membersService";
import { RoleBadge, StatusBadge } from "../components/ui/Badge";
import Modal, { ConfirmDialog } from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import PageHeader from "../components/ui/PageHeader";

const INITIAL_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  username: "",
  password: "",
  is_active: true,
  is_super_admin: false,
  is_parish_minister: false,
  is_kirk_session: false,
  // UI-only fields (not in backend yet)
  address: "",
  gender: "Male",
  dob: "",
  baptized: false,
  group: "",
};

export default function Members() {
  const { can } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMember, setViewMember] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail || err.message || "Failed to load members.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filtered = members.filter((m) => {
    const name = m.name || "";
    const email = m.email || "";
    const phone = m.phone || "";
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search);
    const matchRole = filterRole === "all" || m.role === filterRole;
    const matchStatus = filterStatus === "all" || m.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  // Stable handler for form field changes
  const handleFormChange = useCallback(
    (field) => (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    [],
  );

  // Stable handler for checkbox changes
  const handleCheckboxChange = useCallback(
    (field) => (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.checked }));
    },
    [],
  );

  const handleAdd = async () => {
    setSaveError(null);
    try {
      // Build payload for backend
      const payload = {
        username:
          form.username ||
          `${form.first_name.toLowerCase()}.${form.last_name.toLowerCase()}`,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_number: form.phone_number,
        password: form.password || "changeme123",
        is_active: form.is_active,
        is_super_admin: form.is_super_admin,
        is_parish_minister: form.is_parish_minister,
        is_kirk_session: form.is_kirk_session,
      };
      const newMember = await createMember(payload);
      setMembers([newMember, ...members]);
      setAddOpen(false);
      setForm(INITIAL_FORM);
    } catch (err) {
      const detail = err?.response?.data;
      setSaveError(
        typeof detail === "string"
          ? detail
          : JSON.stringify(detail) || err.message || "Failed to add member.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editMember) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_number: form.phone_number,
        is_active: form.is_active,
        is_super_admin: form.is_super_admin,
        is_parish_minister: form.is_parish_minister,
        is_kirk_session: form.is_kirk_session,
      };
      const updated = await updateMember(editMember.id, payload);
      setMembers(members.map((m) => (m.id === editMember.id ? updated : m)));
      setEditMember(null);
      setForm(INITIAL_FORM);
    } catch (err) {
      const detail = err?.response?.data;
      setSaveError(
        typeof detail === "string"
          ? detail
          : JSON.stringify(detail) || err.message || "Failed to update member.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMember(id);
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to delete member.",
      );
    }
  };

  const openEdit = (member) => {
    setEditMember(member);
    setForm({
      first_name: member.name?.split(" ")[0] || "",
      last_name: member.name?.split(" ").slice(1).join(" ") || "",
      email: member.email || "",
      phone_number: member.phone || "",
      username: member.username || "",
      password: "",
      is_active: member.status === "active",
      is_super_admin: member.is_super_admin || false,
      is_parish_minister: member.is_parish_minister || false,
      is_kirk_session: member.is_kirk_session || false,
      address: member.address || "",
      gender: member.gender || "Male",
      dob: member.dob || "",
      baptized: member.baptized || false,
      group: member.group || "",
    });
    setSaveError(null);
  };

  const MemberForm = ({ onSubmit, submitLabel, isAdd }) => (
    <div className="space-y-4">
      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {saveError}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            value={form.first_name}
            onChange={handleFormChange("first_name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="First name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            value={form.last_name}
            onChange={handleFormChange("last_name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Last name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={handleFormChange("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            value={form.phone_number}
            onChange={handleFormChange("phone_number")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="+254 7XX XXX XXX"
          />
        </div>
        {isAdd && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                value={form.username}
                onChange={handleFormChange("username")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={form.password}
                onChange={handleFormChange("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Min 8 characters"
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={form.gender}
            onChange={handleFormChange("gender")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={form.dob}
            onChange={handleFormChange("dob")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={
              form.is_super_admin
                ? "superadmin"
                : form.is_parish_minister
                  ? "pastor"
                  : form.is_kirk_session
                    ? "elder"
                    : "member"
            }
            onChange={(e) => {
              const v = e.target.value;
              setForm({
                ...form,
                is_super_admin: false, // Only super admin can set this
                is_parish_minister: v === "Parish Minister",
                is_kirk_session: v === "Elder",
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="member">Member</option>
            <option value="elder">Elder</option>
            <option value="pastor">Parish Minister</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={form.is_active ? "active" : "inactive"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                is_active: e.target.value === "active",
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group
          </label>
          <input
            value={form.group}
            onChange={handleFormChange("group")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Youth Fellowship"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          value={form.address}
          onChange={handleFormChange("address")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Physical address"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="baptized"
          checked={form.baptized}
          onChange={handleCheckboxChange("baptized")}
          className="w-4 h-4 text-indigo-600 rounded"
        />
        <label htmlFor="baptized" className="text-sm text-gray-700">
          Baptized
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setAddOpen(false);
            setEditMember(null);
            setForm(INITIAL_FORM);
            setSaveError(null);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <PageHeader
          title="Members"
          subtitle={`${filtered.length} of ${members.length} members`}
          icon={Users}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={loadMembers}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-500"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
              {can("members", "create") && (
                <button
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setSaveError(null);
                    setAddOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                  <Plus size={16} />
                  Add Member
                </button>
              )}
            </div>
          }
        />

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadMembers}
              className="text-red-600 hover:underline text-xs ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search members..."
            className="flex-1"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="pastor">Parish Minister</option>
            <option value="elder">Elder</option>
            <option value="member">Member</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Contact
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Group
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-400"
                      >
                        <Users size={40} className="mx-auto mb-2 opacity-30" />
                        <p>No members found</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                              {(member.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-500 md:hidden">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail size={12} className="text-gray-400" />{" "}
                            {member.email}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone size={11} className="text-gray-400" />{" "}
                            {member.phone || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <span className="text-sm text-gray-600">
                            {member.group || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <RoleBadge role={member.role} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={member.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewMember(member)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                              title="View"
                            >
                              <Eye size={15} />
                            </button>
                            {can("members", "update") && (
                              <button
                                onClick={() => openEdit(member)}
                                className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                                title="Edit"
                              >
                                <Edit2 size={15} />
                              </button>
                            )}
                            {can("members", "delete") && (
                              <button
                                onClick={() => setDeleteTarget(member)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setForm(INITIAL_FORM);
          setSaveError(null);
        }}
        title="Add New Member"
        size="lg"
      >
        <MemberForm onSubmit={handleAdd} submitLabel="Add Member" isAdd />
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={!!editMember}
        onClose={() => {
          setEditMember(null);
          setForm(INITIAL_FORM);
          setSaveError(null);
        }}
        title="Edit Member"
        size="lg"
      >
        <MemberForm
          onSubmit={handleEdit}
          submitLabel="Save Changes"
          isAdd={false}
        />
      </Modal>

      {/* View Member Modal */}
      <Modal
        isOpen={!!viewMember}
        onClose={() => setViewMember(null)}
        title="Member Details"
        size="md"
      >
        {viewMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-600">
                {(viewMember.name || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {viewMember.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <RoleBadge role={viewMember.role} />
                  <StatusBadge status={viewMember.status} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Email", value: viewMember.email, icon: Mail },
                { label: "Phone", value: viewMember.phone, icon: Phone },
                { label: "Gender", value: viewMember.gender, icon: Users },
                {
                  label: "Date of Birth",
                  value: viewMember.dob,
                  icon: Calendar,
                },
                { label: "Address", value: viewMember.address, icon: MapPin },
                { label: "Group", value: viewMember.group, icon: Users },
                {
                  label: "Join Date",
                  value: viewMember.joinDate,
                  icon: Calendar,
                },
                {
                  label: "Baptized",
                  value: viewMember.baptized ? "Yes" : "No",
                  icon: Users,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="font-medium text-gray-800 flex items-center gap-1">
                    <Icon size={12} className="text-gray-400" />
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          handleDelete(deleteTarget?.id);
          setDeleteTarget(null);
        }}
        title="Delete Member"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
}
