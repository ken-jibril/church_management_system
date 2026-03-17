/**
 * Groups Management Page - Covenant Cloud Church Management System
 * Uses groupsService (mock-backed until backend endpoint is added).
 * Groups have their own leadership roles: chairperson, vice_chairperson,
 * secretary, vice_secretary, treasurer (and vice_treasurer for PCMF only)
 * Members must be approved by group leadership to access group details.
 */
import { useState, useEffect, useCallback } from "react";
import {
  UsersRound,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Lock,
  Users,
  Crown,
  Shield,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../services/groupsService";
import { StatusBadge } from "../components/ui/Badge";
import Modal, { ConfirmDialog } from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";

const INITIAL_FORM = {
  name: "",
  description: "",
  patron: "",
  chairperson: "",
  vice_chairperson: "",
  secretary: "",
  vice_secretary: "",
  treasurer: "",
  vice_treasurer: "",
  meetingDay: "",
  meetingTime: "",
  status: "active",
  isPCMF: false,
};

// Simulate current user's group memberships (in production, from API)
const USER_GROUP_MEMBERSHIPS = [
  { groupId: 1, approved: true, role: "member" },
  { groupId: 3, approved: true, role: "member" },
  // Not a member of groups 2, 4, 5
];

export default function Groups() {
  const { can, role } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [viewGroup, setViewGroup] = useState(null);
  const [editGroup, setEditGroup] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [accessRequest, setAccessRequest] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail || err.message || "Failed to load groups.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Stable handlers for form field changes
  const handleFormChange = useCallback(
    (field) => (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    [],
  );

  const handleCheckboxChange = useCallback(
    (field) => (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.checked }));
    },
    [],
  );

  const isAdmin = [
    "superadmin",
    "admin",
    "pastor",
    "elder",
    "treasurer",
    "registrar",
    "deputy_registrar",
  ].includes(role);

  const canViewGroup = (group) => {
    if (isAdmin) return true;
    const membership = USER_GROUP_MEMBERSHIPS.find(
      (m) => m.groupId === group.id,
    );
    return membership && membership.approved;
  };

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    const newGroup = { ...form, id: Date.now(), members: 0 };
    setGroups([newGroup, ...groups]);
    setAddOpen(false);
    setForm(INITIAL_FORM);
  };

  const handleEdit = () => {
    setGroups(
      groups.map((g) =>
        g.id === editGroup.id ? { ...editGroup, ...form } : g,
      ),
    );
    setEditGroup(null);
    setForm(INITIAL_FORM);
  };

  const handleDelete = (id) => setGroups(groups.filter((g) => g.id !== id));

  const openEdit = (group) => {
    setEditGroup(group);
    setForm({ ...group });
  };

  const GroupForm = ({ onSubmit, submitLabel }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={handleFormChange("description")}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Group description..."
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patron (Elder)
          </label>
          <input
            value={form.patron}
            onChange={handleFormChange("patron")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Patron name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chairperson
          </label>
          <input
            value={form.chairperson}
            onChange={handleFormChange("chairperson")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Chairperson name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vice Chairperson
          </label>
          <input
            value={form.vice_chairperson}
            onChange={handleFormChange("vice_chairperson")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Vice Chairperson name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Secretary
          </label>
          <input
            value={form.secretary}
            onChange={handleFormChange("secretary")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Secretary name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vice Secretary
          </label>
          <input
            value={form.vice_secretary}
            onChange={handleFormChange("vice_secretary")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Vice Secretary name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Treasurer
          </label>
          <input
            value={form.treasurer}
            onChange={handleFormChange("treasurer")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Treasurer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Day
          </label>
          <input
            value={form.meetingDay}
            onChange={handleFormChange("meetingDay")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Every Saturday"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Time
          </label>
          <input
            value={form.meetingTime}
            onChange={handleFormChange("meetingTime")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 10:00 AM"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPCMF"
            checked={form.isPCMF}
            onChange={handleCheckboxChange("isPCMF")}
            className="w-4 h-4 text-indigo-600 rounded"
          />
          <label htmlFor="isPCMF" className="text-sm text-gray-700">
            This is a PCMF group (has Vice Treasurer role)
          </label>
        </div>
      </div>
      {form.isPCMF && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vice Treasurer (PCMF only)
          </label>
          <input
            value={form.vice_treasurer}
            onChange={handleFormChange("vice_treasurer")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Vice Treasurer name"
          />
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setAddOpen(false);
            setEditGroup(null);
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

  const LeadershipRow = ({ label, name, icon: Icon }) =>
    name ? (
      <div className="flex items-center gap-2 py-1.5">
        <Icon size={14} className="text-indigo-400 flex-shrink-0" />
        <span className="text-xs text-gray-500 w-28 flex-shrink-0">
          {label}:
        </span>
        <span className="text-sm font-medium text-gray-800">{name}</span>
      </div>
    ) : null;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <PageHeader
          title="Groups"
          subtitle={`${groups.length} church groups`}
          icon={UsersRound}
          actions={
            can("groups", "create") && (
              <button
                onClick={() => {
                  setForm(INITIAL_FORM);
                  setAddOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
              >
                <Plus size={16} />
                Create Group
              </button>
            )
          }
        />

        {/* Access notice for members */}
        {!isAdmin && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Lock size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Group Access Policy
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                You can only view details of groups you are an approved member
                of. Contact the group chairperson, vice-chairperson, secretary,
                vice-secretary, or treasurer to request access.
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search groups..."
          className="max-w-md"
        />

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400">
              <UsersRound size={48} className="mx-auto mb-3 opacity-30" />
              <p>No groups found</p>
            </div>
          ) : (
            filtered.map((group) => {
              const hasAccess = canViewGroup(group);
              return (
                <div
                  key={group.id}
                  className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition hover:shadow-md ${hasAccess ? "border-gray-100" : "border-gray-100 opacity-80"}`}
                >
                  {/* Header */}
                  <div
                    className={`p-5 ${group.isPCMF ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-gradient-to-r from-slate-700 to-slate-600"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            {group.name}
                          </h3>
                          {group.isPCMF && (
                            <Badge variant="warning">PCMF</Badge>
                          )}
                        </div>
                        <p className="text-xs text-white/70 mt-1">
                          {group.members} members
                        </p>
                      </div>
                      {!hasAccess && (
                        <div className="bg-white/20 rounded-lg p-1.5">
                          <Lock size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {group.description}
                    </p>

                    {hasAccess ? (
                      <>
                        {/* Leadership */}
                        <div className="space-y-0.5 mb-4">
                          <LeadershipRow
                            label="Patron"
                            name={group.patron}
                            icon={Shield}
                          />
                          <LeadershipRow
                            label="Chairperson"
                            name={group.chairperson}
                            icon={Crown}
                          />
                          <LeadershipRow
                            label="Secretary"
                            name={group.secretary}
                            icon={Users}
                          />
                          <LeadershipRow
                            label="Treasurer"
                            name={group.treasurer}
                            icon={Users}
                          />
                          {group.isPCMF && group.vice_treasurer && (
                            <LeadershipRow
                              label="Vice Treasurer"
                              name={group.vice_treasurer}
                              icon={Users}
                            />
                          )}
                        </div>

                        {/* Meeting info */}
                        <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 mb-4">
                          <span className="font-medium">Meets:</span>{" "}
                          {group.meetingDay} at {group.meetingTime}
                        </div>
                      </>
                    ) : (
                      <div className="bg-amber-50 rounded-xl p-3 mb-4 flex items-center gap-2">
                        <Lock size={14} className="text-amber-500" />
                        <p className="text-xs text-amber-700">
                          Request access to view group details
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <StatusBadge status={group.status} />
                      <div className="flex items-center gap-1">
                        {hasAccess ? (
                          <button
                            onClick={() => setViewGroup(group)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setAccessRequest(group)}
                            className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                          >
                            Request Access
                          </button>
                        )}
                        {can("groups", "update") && (
                          <button
                            onClick={() => openEdit(group)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                        )}
                        {can("groups", "delete") && (
                          <button
                            onClick={() => setDeleteTarget(group)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setForm(INITIAL_FORM);
        }}
        title="Create Group"
        size="lg"
      >
        <GroupForm onSubmit={handleAdd} submitLabel="Create Group" />
      </Modal>
      <Modal
        isOpen={!!editGroup}
        onClose={() => {
          setEditGroup(null);
          setForm(INITIAL_FORM);
        }}
        title="Edit Group"
        size="lg"
      >
        <GroupForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </Modal>

      {/* View Group Details */}
      <Modal
        isOpen={!!viewGroup}
        onClose={() => setViewGroup(null)}
        title={viewGroup?.name}
        size="lg"
      >
        {viewGroup && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${viewGroup.isPCMF ? "bg-indigo-600" : "bg-slate-700"}`}
              >
                <UsersRound size={22} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {viewGroup.name}
                  </h3>
                  {viewGroup.isPCMF && <Badge variant="indigo">PCMF</Badge>}
                </div>
                <p className="text-sm text-gray-500">
                  {viewGroup.members} members · {viewGroup.meetingDay}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
              {viewGroup.description}
            </p>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Group Leadership
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {
                    label: "Patron",
                    value: viewGroup.patron,
                    color: "bg-purple-50 text-purple-700",
                  },
                  {
                    label: "Chairperson",
                    value: viewGroup.chairperson,
                    color: "bg-indigo-50 text-indigo-700",
                  },
                  {
                    label: "Vice Chairperson",
                    value: viewGroup.vice_chairperson,
                    color: "bg-blue-50 text-blue-700",
                  },
                  {
                    label: "Secretary",
                    value: viewGroup.secretary,
                    color: "bg-green-50 text-green-700",
                  },
                  {
                    label: "Vice Secretary",
                    value: viewGroup.vice_secretary,
                    color: "bg-teal-50 text-teal-700",
                  },
                  {
                    label: "Treasurer",
                    value: viewGroup.treasurer,
                    color: "bg-orange-50 text-orange-700",
                  },
                  ...(viewGroup.isPCMF && viewGroup.vice_treasurer
                    ? [
                        {
                          label: "Vice Treasurer (PCMF)",
                          value: viewGroup.vice_treasurer,
                          color: "bg-rose-50 text-rose-700",
                        },
                      ]
                    : []),
                ].map(({ label, value, color }) =>
                  value ? (
                    <div key={label} className={`${color} rounded-xl p-3`}>
                      <p className="text-xs opacity-70 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold">{value}</p>
                    </div>
                  ) : null,
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Meeting Schedule
              </h4>
              <p className="text-sm text-gray-600">
                {viewGroup.meetingDay} at {viewGroup.meetingTime}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Access Request Modal */}
      <Modal
        isOpen={!!accessRequest}
        onClose={() => setAccessRequest(null)}
        title="Request Group Access"
        size="sm"
      >
        {accessRequest && (
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                To join <strong>{accessRequest.name}</strong>, your request must
                be approved by the group leadership:
              </p>
              <ul className="mt-2 text-xs text-amber-700 space-y-1">
                <li>• Chairperson: {accessRequest.chairperson}</li>
                <li>• Vice Chairperson: {accessRequest.vice_chairperson}</li>
                <li>• Secretary: {accessRequest.secretary}</li>
                <li>• Vice Secretary: {accessRequest.vice_secretary}</li>
                <li>• Treasurer: {accessRequest.treasurer}</li>
                {accessRequest.isPCMF && accessRequest.vice_treasurer && (
                  <li>• Vice Treasurer: {accessRequest.vice_treasurer}</li>
                )}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (optional)
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Introduce yourself or explain why you'd like to join..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAccessRequest(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(
                    "Access request sent! You will be notified when approved.",
                  );
                  setAccessRequest(null);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
              >
                Send Request
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Group"
        message={`Delete "${deleteTarget?.name}"? All group data will be lost. This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
}
