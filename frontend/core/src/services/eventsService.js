/**
 * Events Service
 * Wraps all /activities/events/ API calls.
 *
 * Backend endpoints:
 *   GET    /activities/events/         → list all events
 *   POST   /activities/events/         → create event
 *   GET    /activities/events/{id}/    → retrieve event
 *   PUT    /activities/events/{id}/    → update event
 *   PATCH  /activities/events/{id}/    → partial update
 *   DELETE /activities/events/{id}/    → delete event
 *
 * Backend Event fields: id, name, group, date, created_at
 *
 * NOTE: The backend Event model is minimal (name, group, date).
 * Frontend fields like time, location, type, organizer, attendees,
 * status, description are not yet in the backend — they are kept
 * as empty defaults so the UI remains functional.
 */
import api from "../api/axios";

// ── Helpers ──────────────────────────────────────────────────────────────────

export const normaliseEvent = (raw) => ({
  id: raw.id,
  title: raw.name || raw.title || "",
  name: raw.name || raw.title || "",
  date: raw.date || "",
  time: raw.time || "",
  location: raw.location || "",
  type: raw.type || "Worship",
  organizer: raw.organizer || "",
  attendees: raw.attendees || 0,
  status:
    raw.status ||
    (raw.date && new Date(raw.date) >= new Date() ? "upcoming" : "completed"),
  description: raw.description || "",
  group: raw.group || null,
  created_at: raw.created_at || "",
});

// ── CRUD ─────────────────────────────────────────────────────────────────────

export const getEvents = async () => {
  const res = await api.get("/activities/events/");
  const data = Array.isArray(res.data) ? res.data : res.data.results || [];
  return data.map(normaliseEvent);
};

export const getEvent = async (id) => {
  const res = await api.get(`/activities/events/${id}/`);
  return normaliseEvent(res.data);
};

export const createEvent = async (payload) => {
  // Map frontend shape → backend shape
  const body = {
    name: payload.title || payload.name,
    date: payload.date,
    group: payload.group || null,
    // extra fields stored if backend supports them
    ...(payload.time && { time: payload.time }),
    ...(payload.location && { location: payload.location }),
    ...(payload.type && { type: payload.type }),
    ...(payload.organizer && { organizer: payload.organizer }),
    ...(payload.description && { description: payload.description }),
    ...(payload.status && { status: payload.status }),
  };
  const res = await api.post("/activities/events/", body);
  return normaliseEvent(res.data);
};

export const updateEvent = async (id, payload) => {
  const body = {
    name: payload.title || payload.name,
    date: payload.date,
    group: payload.group || null,
    ...(payload.time && { time: payload.time }),
    ...(payload.location && { location: payload.location }),
    ...(payload.type && { type: payload.type }),
    ...(payload.organizer && { organizer: payload.organizer }),
    ...(payload.description && { description: payload.description }),
    ...(payload.status && { status: payload.status }),
  };
  const res = await api.patch(`/activities/events/${id}/`, body);
  return normaliseEvent(res.data);
};

export const deleteEvent = async (id) => {
  await api.delete(`/activities/events/${id}/`);
};
