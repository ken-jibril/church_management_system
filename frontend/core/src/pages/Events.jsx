/**
 * Events Management Page - Covenant Cloud Church Management System
 * Uses real backend API via eventsService.
 */
import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Users,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventsService";
import { StatusBadge } from "../components/ui/Badge";
import Modal, { ConfirmDialog } from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import PageHeader from "../components/ui/PageHeader";

const EVENT_TYPES = [
  "Worship",
  "Bible Study",
  "Fellowship",
  "Meeting",
  "Special Service",
  "Fundraiser",
  "Practice",
  "Conference",
  "Other",
];

const INITIAL_FORM = {
  title: "",
  date: new Date().toISOString().split("T")[0],
  time: "09:00 AM",
  location: "",
  type: "Worship",
  organizer: "",
  attendees: "",
  status: "upcoming",
  description: "",
};

const typeColors = {
  Worship: "bg-indigo-100 text-indigo-700",
  "Bible Study": "bg-blue-100 text-blue-700",
  Fellowship: "bg-green-100 text-green-700",
  Meeting: "bg-gray-100 text-gray-700",
  "Special Service": "bg-purple-100 text-purple-700",
  Fundraiser: "bg-orange-100 text-orange-700",
  Practice: "bg-yellow-100 text-yellow-700",
  Conference: "bg-rose-100 text-rose-700",
  Other: "bg-gray-100 text-gray-700",
};

export default function Events() {
  const { can } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // list | grid
  const [viewEvent, setViewEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail || err.message || "Failed to load events.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filtered = events.filter((e) => {
    const title = e.title || "";
    const organizer = e.organizer || "";
    const location = e.location || "";
    const matchSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      organizer.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || e.type === filterType;
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const handleAdd = async () => {
    setSaving(true);
    try {
      const payload = { ...form, attendees: parseInt(form.attendees) || 0 };
      const newEvent = await createEvent(payload);
      setEvents([newEvent, ...events]);
      setAddOpen(false);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(
        err?.response?.data?.detail || err.message || "Failed to add event.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editEvent) return;
    setSaving(true);
    try {
      const payload = { ...form, attendees: parseInt(form.attendees) || 0 };
      const updated = await updateEvent(editEvent.id, payload);
      setEvents(events.map((e) => (e.id === editEvent.id ? updated : e)));
      setEditEvent(null);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(
        err?.response?.data?.detail || err.message || "Failed to update event.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      alert(
        err?.response?.data?.detail || err.message || "Failed to delete event.",
      );
    }
  };

  const openEdit = (event) => {
    setEditEvent(event);
    setForm({ ...event, attendees: (event.attendees || 0).toString() });
  };

  const EventForm = ({ onSubmit, submitLabel }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Title *
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Event title"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            Time
          </label>
          <input
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="09:00 AM"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Venue / location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organizer
          </label>
          <input
            value={form.organizer}
            onChange={(e) => setForm({ ...form, organizer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Organizer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Attendees
          </label>
          <input
            type="number"
            value={form.attendees}
            onChange={(e) => setForm({ ...form, attendees: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0"
          />
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
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Event description..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setAddOpen(false);
            setEditEvent(null);
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
          title="Events"
          subtitle={`${filtered.length} events`}
          icon={Calendar}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={loadEvents}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-500"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
              {can("events", "create") && (
                <button
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setAddOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                  <Plus size={16} />
                  Create Event
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
              onClick={loadEvents}
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
            placeholder="Search events..."
            className="flex-1"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400">
              <Calendar size={48} className="mx-auto mb-3 opacity-30" />
              <p>No events found</p>
            </div>
          ) : (
            filtered.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                {/* Color bar */}
                <div
                  className={`h-1.5 ${event.status === "upcoming" ? "bg-indigo-500" : event.status === "completed" ? "bg-green-500" : "bg-red-400"}`}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[event.type] || "bg-gray-100 text-gray-700"}`}
                      >
                        {event.type}
                      </span>
                      <h3 className="text-base font-semibold text-gray-800 mt-2">
                        {event.title}
                      </h3>
                    </div>
                    <StatusBadge status={event.status} />
                  </div>

                  <div className="space-y-1.5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={13}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock
                        size={13}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={13}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users
                        size={13}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span>{event.attendees} expected</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => setViewEvent(event)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                      title="View"
                    >
                      <Eye size={15} />
                    </button>
                    {can("events", "update") && (
                      <button
                        onClick={() => openEdit(event)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                    )}
                    {can("events", "delete") && (
                      <button
                        onClick={() => setDeleteTarget(event)}
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
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setForm(INITIAL_FORM);
        }}
        title="Create Event"
        size="lg"
      >
        <EventForm onSubmit={handleAdd} submitLabel="Create Event" />
      </Modal>
      <Modal
        isOpen={!!editEvent}
        onClose={() => {
          setEditEvent(null);
          setForm(INITIAL_FORM);
        }}
        title="Edit Event"
        size="lg"
      >
        <EventForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </Modal>
      <Modal
        isOpen={!!viewEvent}
        onClose={() => setViewEvent(null)}
        title="Event Details"
        size="md"
      >
        {viewEvent && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex flex-col items-center justify-center text-indigo-600 flex-shrink-0">
                <span className="text-lg font-bold leading-none">
                  {new Date(viewEvent.date).getDate()}
                </span>
                <span className="text-xs">
                  {new Date(viewEvent.date).toLocaleString("en", {
                    month: "short",
                  })}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {viewEvent.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[viewEvent.type] || "bg-gray-100 text-gray-700"}`}
                  >
                    {viewEvent.type}
                  </span>
                  <StatusBadge status={viewEvent.status} />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
              {viewEvent.description}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Date", value: viewEvent.date },
                { label: "Time", value: viewEvent.time },
                { label: "Location", value: viewEvent.location },
                { label: "Organizer", value: viewEvent.organizer },
                { label: "Expected Attendees", value: viewEvent.attendees },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Event"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
}
