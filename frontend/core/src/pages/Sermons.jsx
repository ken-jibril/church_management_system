/**
 * Sermons Management Page - Covenant Cloud Church Management System
 * Uses sermonsService (mock-backed until backend endpoint is added).
 */
import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Play,
  Download,
  Eye,
  Mic,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getSermons,
  createSermon,
  updateSermon,
  deleteSermon,
} from "../services/sermonsService";
import Modal, { ConfirmDialog } from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";

const SERMON_TYPES = [
  "Sunday Service",
  "Mid-Week",
  "Special Service",
  "Conference",
  "Youth Service",
  "Other",
];

const INITIAL_FORM = {
  title: "",
  preacher: "",
  date: new Date().toISOString().split("T")[0],
  series: "",
  scripture: "",
  duration: "",
  type: "Sunday Service",
  audioUrl: "",
  videoUrl: "",
  notes: "",
};

export default function Sermons() {
  const { can } = useAuth();
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewSermon, setViewSermon] = useState(null);
  const [editSermon, setEditSermon] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const loadSermons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSermons();
      setSermons(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail || err.message || "Failed to load sermons.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSermons();
  }, [loadSermons]);

  const filtered = sermons.filter((s) => {
    const title = s.title || "";
    const preacher = s.preacher || "";
    const series = s.series || "";
    const scripture = s.scripture || "";
    const matchSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      preacher.toLowerCase().includes(search.toLowerCase()) ||
      series.toLowerCase().includes(search.toLowerCase()) ||
      scripture.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || s.type === filterType;
    return matchSearch && matchType;
  });

  const handleAdd = async () => {
    try {
      const newSermon = await createSermon(form);
      setSermons([newSermon, ...sermons]);
      setAddOpen(false);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(
        err?.response?.data?.detail || err.message || "Failed to add sermon.",
      );
    }
  };

  const handleEdit = async () => {
    if (!editSermon) return;
    try {
      const updated = await updateSermon(editSermon.id, form);
      setSermons(sermons.map((s) => (s.id === editSermon.id ? updated : s)));
      setEditSermon(null);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to update sermon.",
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSermon(id);
      setSermons(sermons.filter((s) => s.id !== id));
    } catch (err) {
      alert(err?.response?.data?.detail || err.message || "Failed to delete sermon.");
    }
  };

  const openEdit = (sermon) => {
    setEditSermon(sermon);
    setForm({ ...sermon });
  };

  const SermonForm = ({ onSubmit, submitLabel }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sermon Title *
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Sermon title"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preacher *
          </label>
          <input
            value={form.preacher}
            onChange={(e) => setForm({ ...form, preacher: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Preacher name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Series
          </label>
          <input
            value={form.series}
            onChange={(e) => setForm({ ...form, series: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Sermon series name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scripture Reference
          </label>
          <input
            value={form.scripture}
            onChange={(e) => setForm({ ...form, scripture: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. John 3:16"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <input
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 45 min"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SERMON_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Audio URL
          </label>
          <input
            value={form.audioUrl}
            onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video URL
          </label>
          <input
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://..."
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sermon Notes
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Key points and notes..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setAddOpen(false);
            setEditSermon(null);
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
          title="Sermons"
          subtitle={`${filtered.length} sermons in library`}
          icon={BookOpen}
          actions={
            can("sermons", "create") && (
              <button
                onClick={() => {
                  setForm(INITIAL_FORM);
                  setAddOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
              >
                <Plus size={16} />
                Add Sermon
              </button>
            )
          }
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search sermons, preacher, scripture..."
            className="flex-1"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            {SERMON_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Sermons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400">
              <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
              <p>No sermons found</p>
            </div>
          ) : (
            filtered.map((sermon) => (
              <div
                key={sermon.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <Badge variant="indigo">{sermon.type}</Badge>
                    <h3 className="text-base font-semibold text-gray-800 mt-2 leading-tight">
                      {sermon.title}
                    </h3>
                    {sermon.series && (
                      <p className="text-xs text-indigo-600 mt-0.5">
                        Series: {sermon.series}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mic size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="font-medium">{sermon.preacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen
                      size={13}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <span>{sermon.scripture}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{sermon.date}</span>
                    <span>{sermon.duration}</span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} /> {sermon.views} views
                    </span>
                  </div>
                </div>

                {/* Media buttons */}
                <div className="flex items-center gap-2 mb-3">
                  {sermon.audioUrl && (
                    <a
                      href={sermon.audioUrl}
                      className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                    >
                      <Play size={12} /> Audio
                    </a>
                  )}
                  {sermon.videoUrl && (
                    <a
                      href={sermon.videoUrl}
                      className="flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2.5 py-1.5 rounded-lg hover:bg-purple-100 transition"
                    >
                      <Play size={12} /> Video
                    </a>
                  )}
                  <a
                    href="#"
                    className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition ml-auto"
                  >
                    <Download size={12} /> Notes
                  </a>
                </div>

                <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => setViewSermon(sermon)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                    title="View"
                  >
                    <Eye size={15} />
                  </button>
                  {can("sermons", "update") && (
                    <button
                      onClick={() => openEdit(sermon)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                  )}
                  {can("sermons", "delete") && (
                    <button
                      onClick={() => setDeleteTarget(sermon)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
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
        title="Add Sermon"
        size="lg"
      >
        <SermonForm onSubmit={handleAdd} submitLabel="Add Sermon" />
      </Modal>
      <Modal
        isOpen={!!editSermon}
        onClose={() => {
          setEditSermon(null);
          setForm(INITIAL_FORM);
        }}
        title="Edit Sermon"
        size="lg"
      >
        <SermonForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </Modal>
      <Modal
        isOpen={!!viewSermon}
        onClose={() => setViewSermon(null)}
        title="Sermon Details"
        size="md"
      >
        {viewSermon && (
          <div className="space-y-4">
            <div>
              <Badge variant="indigo">{viewSermon.type}</Badge>
              <h3 className="text-xl font-bold text-gray-800 mt-2">
                {viewSermon.title}
              </h3>
              {viewSermon.series && (
                <p className="text-sm text-indigo-600">
                  Series: {viewSermon.series}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Preacher", value: viewSermon.preacher },
                { label: "Scripture", value: viewSermon.scripture },
                { label: "Date", value: viewSermon.date },
                { label: "Duration", value: viewSermon.duration },
                { label: "Views", value: viewSermon.views },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
            {viewSermon.notes && (
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-xs font-medium text-indigo-600 mb-1">
                  Sermon Notes
                </p>
                <p className="text-sm text-gray-700">{viewSermon.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Sermon"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
}
