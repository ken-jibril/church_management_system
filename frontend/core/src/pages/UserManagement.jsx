/**
 * User Management Page - Covenant Cloud Church Management System
 * Uses usersService (real backend API via /members/all/).
 * Only accessible by superadmin and admin
 */
import { useState, useEffect, useCallback } from "react";
import {
  UserCog,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Shield,
  Key,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/usersService";
import { RoleBadge, StatusBadge } from "../components/ui/Badge";
import Modal, { ConfirmDialog } from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import PageHeader from "../components/ui/PageHeader";

const ROLES = [
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "pastor", label: "Pastor (Parish Minister)" },
  { value: "elder", label: "Elder (Church Elder)" },
  { value: "treasurer", label: "Treasurer (Church Treasurer)" },
  { value: "registrar", label: "Registrar" },
  { value: "deputy_registrar", label: "Deputy Registrar" },
  { value: "member", label: "Member" },
];

const ROLE_PERMISSIONS = {
  superadmin: [
    "Full CRUD on all modules",
    "User management",
    "System settings",
    "Delete records",
  ],
  admin: ["Full CRUD on all modules", "User management", "System settings"],
  pastor: [
    "Create, Read, Update on all modules",
    "No delete access",
    "No user management",
  ],
  elder: [
    "Create, Read, Update on all modules",
    "No delete access",
    "Group patron",
  ],
  treasurer: [
    "Create, Read, Update on all modules",
    "No delete access",
    "Financial oversight",
  ],
  registrar: [
    "Create, Read, Update on all modules",
    "No delete access",
    "Member registration",
  ],
  deputy_registrar: [
    "Create, Read, Update on all modules",
    "No delete access",
    "Assist registrar",
  ],
  member: [
    "Read only access",
    "Submit prayer requests",
    "View events and sermons",
  ],
};

const INITIAL_FORM = {
  name: "",
  email: "",
  role: "member",
  status: "active",
};

export default function UserManagement() {
  const { can, role: currentRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [permissionsView, setPermissionsView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail || err.message || "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const [form, setForm] = useState(INITIAL_FORM);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleAdd = () => {
    const newUser = {
      ...form,
      id: Date.now(),
      lastLogin: "Never",
      createdAt: new Date().toISOString().split("T")[0],
      avatar: null,
    };
    setUsers([newUser, ...users]);
    setAddOpen(false);
    setForm(INITIAL_FORM);
  };

  const handleEdit = () => {
    setUsers(
      users.map((u) => (u.id === editUser.id ? { ...editUser, ...form } : u)),
    );
    setEditUser(null);
    setForm(INITIAL_FORM);
  };

  const handleDelete = (id) => setUsers(users.filter((u) => u.id !== id));

  const openEdit = (user) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const UserForm = ({ onSubmit, submitLabel }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ROLES.filter(
              (r) => currentRole === "superadmin" || r.value !== "superadmin",
            ).map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      {/* Role permissions preview */}
      {form.role && (
        <div className="bg-indigo-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-700 mb-2">
            Permissions for {ROLES.find((r) => r.value === form.role)?.label}:
          </p>
          <ul className="space-y-1">
            {(ROLE_PERMISSIONS[form.role] || []).map((perm) => (
              <li
                key={perm}
                className="text-xs text-indigo-600 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                {perm}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setAddOpen(false);
            setEditUser(null);
            setForm(INITIAL_FORM);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <PageHeader
          title="User Management"
          subtitle="Manage system users and their roles"
          icon={UserCog}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPermissionsView(true)}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                <Shield size={16} />
                Permissions
              </button>
              {can("users", "create") && (
                <button
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setAddOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                  <Plus size={16} />
                  Add User
                </button>
              )}
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Users", value: users.length },
            {
              label: "Active",
              value: users.filter((u) => u.status === "active").length,
            },
            {
              label: "Inactive",
              value: users.filter((u) => u.status === "inactive").length,
            },
            {
              label: "Roles",
              value: [...new Set(users.map((u) => u.role))].length,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-100 p-4 text-center"
            >
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search users..."
            className="flex-1"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Last Login
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Created
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      <UserCog size={40} className="mx-auto mb-2 opacity-30" />
                      <p>No users found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600">
                          {user.lastLogin}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-gray-600">
                          {user.createdAt}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewUser(user)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          {can("users", "update") && (
                            <button
                              onClick={() => openEdit(user)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                          )}
                          {can("users", "delete") &&
                            user.role !== "superadmin" && (
                              <button
                                onClick={() => setDeleteTarget(user)}
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
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setForm(INITIAL_FORM);
        }}
        title="Add User"
        size="md"
      >
        <UserForm onSubmit={handleAdd} submitLabel="Add User" />
      </Modal>
      <Modal
        isOpen={!!editUser}
        onClose={() => {
          setEditUser(null);
          setForm(INITIAL_FORM);
        }}
        title="Edit User"
        size="md"
      >
        <UserForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </Modal>
      <Modal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title="User Details"
        size="sm"
      >
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-600">
                {viewUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {viewUser.name}
                </h3>
                <p className="text-sm text-gray-500">{viewUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <RoleBadge role={viewUser.role} />
                  <StatusBadge status={viewUser.status} />
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-indigo-700 mb-2">
                Permissions:
              </p>
              <ul className="space-y-1">
                {(ROLE_PERMISSIONS[viewUser.role] || []).map((perm) => (
                  <li
                    key={perm}
                    className="text-xs text-indigo-600 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">Last Login</p>
                <p className="font-medium text-gray-800">
                  {viewUser.lastLogin}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">Created</p>
                <p className="font-medium text-gray-800">
                  {viewUser.createdAt}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Permissions Overview Modal */}
      <Modal
        isOpen={!!permissionsView}
        onClose={() => setPermissionsView(null)}
        title="Role Permissions Overview"
        size="xl"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Overview of what each role can do in the system:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700">
                    Create
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700">
                    Read
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700">
                    Update
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700">
                    Delete
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700">
                    User Mgmt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    role: "superadmin",
                    label: "Super Admin",
                    create: true,
                    read: true,
                    update: true,
                    delete: true,
                    userMgmt: true,
                  },
                  {
                    role: "admin",
                    label: "Admin",
                    create: true,
                    read: true,
                    update: true,
                    delete: true,
                    userMgmt: true,
                  },
                  {
                    role: "pastor",
                    label: "Pastor",
                    create: true,
                    read: true,
                    update: true,
                    delete: false,
                    userMgmt: false,
                  },
                  {
                    role: "elder",
                    label: "Elder",
                    create: true,
                    read: true,
                    update: true,
                    delete: false,
                    userMgmt: false,
                  },
                  {
                    role: "treasurer",
                    label: "Treasurer",
                    create: true,
                    read: true,
                    update: true,
                    delete: false,
                    userMgmt: false,
                  },
                  {
                    role: "registrar",
                    label: "Registrar",
                    create: true,
                    read: true,
                    update: true,
                    delete: false,
                    userMgmt: false,
                  },
                  {
                    role: "deputy_registrar",
                    label: "Deputy Registrar",
                    create: true,
                    read: true,
                    update: true,
                    delete: false,
                    userMgmt: false,
                  },
                  {
                    role: "member",
                    label: "Member",
                    create: false,
                    read: true,
                    update: false,
                    delete: false,
                    userMgmt: false,
                  },
                ].map((r) => (
                  <tr key={r.role} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <RoleBadge role={r.role} />
                    </td>
                    {["create", "read", "update", "delete", "userMgmt"].map(
                      (action) => (
                        <td key={action} className="px-3 py-3 text-center">
                          {r[action] ? (
                            <span className="text-green-600 font-bold">✓</span>
                          ) : (
                            <span className="text-red-400">✗</span>
                          )}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete User"
        message={`Delete user "${deleteTarget?.name}"? They will lose all access to the system.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
}
