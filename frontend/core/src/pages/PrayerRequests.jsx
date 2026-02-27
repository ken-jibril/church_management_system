/**
 * Prayer Requests Management Page - Covenant Cloud Church Management System
 * Uses prayerRequestsService (mock-backed until backend endpoint is added).
 */
import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  HandHeart,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getPrayerRequests,
  createPrayerRequest,
  updatePrayerRequest,
  deletePrayerRequest,
  incrementPrayedFor,
} from "../services/prayerRequestsService";
import { StatusBadge } from "../components/ui/Badge";
import Modal, { ConfirmDialog } from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import PageHeader from "../components/ui/PageHeader";

const CATEGORIES = [
  "Health",
  "Family",
  "Guidance",
  "Financial",
  "Education",
  "Church",
  "Relationships",
  "Work",
  "Other",
];

const INITIAL_FORM = {
  requester: "",
  request: "",
  category: "Health",
  date: new Date().toISOString().split("T")[0],
  status: "active",
  isAnonymous: false,
};

const categoryColors = {
  Health: "bg-red-100 text-red-700",
  Family: "bg-pink-100 text-pink-700",
  Guidance: "bg-blue-100 text-blue-700",
  Financial: "bg-green-100 text-green-700",
  Education: "bg-yellow-100 text-yellow-700",
  Church: "bg-indigo-100 text-indigo-700",
  Relationships: "bg-purple-100 text-purple-700",
  Work: "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-700",
};

export default function PrayerRequests() {
  const { can, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editRequest, setEditRequest] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPrayerRequests();
      setRequests(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to load prayer requests.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const filtered = requests.filter((r) => {
    const req = r.request || "";
    const requester = r.requester || "";
    const matchSearch =
      req.toLowerCase().includes(search.toLowerCase()) ||
      (!r.isAnonymous &&
        requester.toLowerCase().includes(search.toLowerCase()));
    const matchCat = filterCategory === "all" || r.category === filterCategory;
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const handleAdd = async () => {
    try {
      const payload = {
        ...form,
        requester: form.isAnonymous ? "Anonymous" : form.requester,
      };
      const newReq = await createPrayerRequest(payload);
      setRequests([newReq, ...requests]);
      setAddOpen(false);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to add prayer request.",
      );
    }
  };

  const handleEdit = async () => {
    if (!editRequest) return;
    try {
      const updated = await updatePrayerRequest(editRequest.id, form);
      setRequests(requests.map((r) => (r.id === editRequest.id ? updated : r)));
      setEditRequest(null);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to update prayer request.",
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePrayerRequest(id);
      setRequests(requests.filter((r) => r.id !== id));
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to delete prayer request.",
      );
    }
  };

  const handleMarkAnswered = async (id) => {
    try {
      const updated = await updatePrayerRequest(id, { status: "answered" });
      setRequests(requests.map((r) => (r.id === id ? updated : r)));
    } catch {
      setRequests(
        requests.map((r) => (r.id === id ? { ...r, status: "answered" } : r)),
      );
    }
  };

  const handlePray = async (id) => {
    try {
      const updated = await incrementPrayedFor(id);
      setRequests(requests.map((r) => (r.id === id ? updated : r)));
    } catch {
      setRequests(
        requests.map((r) =>
          r.id === id ? { ...r, prayedFor: (r.prayedFor || 0) + 1 } : r,
        ),
      );
    }
  };

  const openEdit = (req) => {
    setEditRequest(req);
    setForm({ ...req });
  };

  const RequestForm = ({ onSubmit, submitLabel }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={form.isAnonymous}
          onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
          className="w-4 h-4 text-indigo-600 rounded"
        />
        <label htmlFor="anonymous" className="text-sm text-gray-700">
          Submit anonymously
        </label>
      </div>
      {!form.isAnonymous && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            value={form.requester}
            onChange={(e) => setForm({ ...form, requester: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your full name"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prayer Request *
        </label>
        <textarea
          value={form.request}
          onChange={(e) => setForm({ ...form, request: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Share your prayer request..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        {can("prayer_requests", "update") && (
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
              <option value="answered">Answered</option>
            </select>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setAddOpen(false);
            setEditRequest(null);
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
          title="Prayer Requests"
          subtitle={`${filtered.filter((r) => r.status === "active").length} active requests`}
          icon={Heart}
          actions={
            can("prayer_requests", "create") && (
              <button
                onClick={() => {
                  setForm(INITIAL_FORM);
                  setAddOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
              >
                <Plus size={16} />
                Submit Request
              </button>
            )
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: requests.length, color: "bg-gray-50" },
            {
              label: "Active",
              value: requests.filter((r) => r.status === "active").length,
              color: "bg-rose-50",
            },
            {
              label: "Answered",
              value: requests.filter((r) => r.status === "answered").length,
              color: "bg-green-50",
            },
            {
              label: "Total Prayers",
              value: requests.reduce((s, r) => s + r.prayedFor, 0),
              color: "bg-indigo-50",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${color} rounded-2xl p-4 text-center`}>
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
            placeholder="Search prayer requests..."
            className="flex-1"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
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
            <option value="answered">Answered</option>
          </select>
        </div>

        {/* Prayer Request Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400">
              <Heart size={48} className="mx-auto mb-3 opacity-30" />
              <p>No prayer requests found</p>
            </div>
          ) : (
            filtered.map((req) => (
              <div
                key={req.id}
                className={`bg-white rounded-2xl shadow-sm border p-5 transition hover:shadow-md ${req.status === "answered" ? "border-green-200 bg-green-50/30" : "border-gray-100"}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${req.isAnonymous ? "bg-gray-200 text-gray-600" : "bg-rose-100 text-rose-600"}`}
                    >
                      {req.isAnonymous ? "?" : req.requester.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {req.isAnonymous ? "Anonymous" : req.requester}
                      </p>
                      <p className="text-xs text-gray-500">{req.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[req.category] || "bg-gray-100 text-gray-700"}`}
                    >
                      {req.category}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {req.request}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handlePray(req.id)}
                    className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 transition font-medium"
                  >
                    <HandHeart size={14} />
                    Prayed ({req.prayedFor})
                  </button>
                  <div className="flex items-center gap-1">
                    {can("prayer_requests", "update") &&
                      req.status === "active" && (
                        <button
                          onClick={() => handleMarkAnswered(req.id)}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition"
                          title="Mark as Answered"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                    {can("prayer_requests", "update") && (
                      <button
                        onClick={() => openEdit(req)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                    )}
                    {can("prayer_requests", "delete") && (
                      <button
                        onClick={() => setDeleteTarget(req)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
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
        title="Submit Prayer Request"
        size="md"
      >
        <RequestForm onSubmit={handleAdd} submitLabel="Submit Request" />
      </Modal>
      <Modal
        isOpen={!!editRequest}
        onClose={() => {
          setEditRequest(null);
          setForm(INITIAL_FORM);
        }}
        title="Edit Prayer Request"
        size="md"
      >
        <RequestForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </Modal>
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Prayer Request"
        message="Delete this prayer request? This cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
}
