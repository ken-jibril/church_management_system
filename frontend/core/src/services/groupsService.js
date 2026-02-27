/**
 * Groups Service
 * NOTE: Backend has a groups model but no REST API endpoints yet.
 * Uses in-memory mock data. Replace with real API calls when available.
 *
 * Future endpoints (when added to backend):
 *   GET    /groups/
 *   POST   /groups/
 *   GET    /groups/{id}/
 *   PUT    /groups/{id}/
 *   DELETE /groups/{id}/
 */
import { mockGroups as _seed } from "./mockData";

let _store = [..._seed];

export const getGroups = async () => [..._store];

export const createGroup = async (payload) => {
  const item = { ...payload, id: Date.now(), members: 0, status: "active" };
  _store = [item, ..._store];
  return item;
};

export const updateGroup = async (id, payload) => {
  _store = _store.map((g) => (g.id === id ? { ...g, ...payload } : g));
  return _store.find((g) => g.id === id);
};

export const deleteGroup = async (id) => {
  _store = _store.filter((g) => g.id !== id);
};
