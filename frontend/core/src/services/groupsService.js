/**
 * Groups Service
 * Uses localStorage for persistence.
 *
 * Endpoints:
 *   GET    /groups/
 *   POST   /groups/
 *   GET    /groups/{id}/
 *   PUT    /groups/{id}/
 *   DELETE /groups/{id}/
 */
import api from "../api/axios";

const STORAGE_KEY = "church_groups";

// Load from localStorage or use default data
const getStoredGroups = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error loading groups from localStorage:", e);
  }
  return [];
};

// Save to localStorage
const saveGroups = (groups) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (e) {
    console.error("Error saving groups to localStorage:", e);
  }
};

// Initialize with stored data
let _store = getStoredGroups();

export const getGroups = async () => {
  // Try to fetch from backend first
  try {
    const res = await api.get("/groups/");
    const data = Array.isArray(res.data) ? res.data : res.data.results || [];
    saveGroups(data); // Cache to localStorage
    return data;
  } catch (error) {
    console.log("Using localStorage for groups:", error.message);
    return _store;
  }
};

export const createGroup = async (payload) => {
  // Try to create on backend first
  try {
    const res = await api.post("/groups/", payload);
    const newGroup = res.data;
    _store = [newGroup, ..._store];
    saveGroups(_store);
    return newGroup;
  } catch (error) {
    console.log("Creating group in localStorage:", error.message);
    // Fallback to localStorage
    const item = { ...payload, id: Date.now(), members: 0, status: "active" };
    _store = [item, ..._store];
    saveGroups(_store);
    return item;
  }
};

export const updateGroup = async (id, payload) => {
  try {
    const res = await api.patch(`/groups/${id}/`, payload);
    const updated = res.data;
    _store = _store.map((g) => (g.id === id ? updated : g));
    saveGroups(_store);
    return updated;
  } catch (error) {
    console.log("Updating group in localStorage:", error.message);
    _store = _store.map((g) => (g.id === id ? { ...g, ...payload } : g));
    saveGroups(_store);
    return _store.find((g) => g.id === id);
  }
};

export const deleteGroup = async (id) => {
  try {
    await api.delete(`/groups/${id}/`);
  } catch (error) {
    console.log("Deleting group from localStorage:", error.message);
  }
  _store = _store.filter((g) => g.id !== id);
  saveGroups(_store);
};
