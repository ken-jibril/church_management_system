/**
 * Sermons Service
 * NOTE: Backend does not yet have a sermons endpoint.
 * Uses in-memory mock data. Replace with real API calls when available.
 */
import { mockSermons as _seed } from "./mockData";

let _store = [..._seed];

export const getSermons = async () => [..._store];

export const createSermon = async (payload) => {
  const item = { ...payload, id: Date.now(), views: 0 };
  _store = [item, ..._store];
  return item;
};

export const updateSermon = async (id, payload) => {
  _store = _store.map((s) => (s.id === id ? { ...s, ...payload } : s));
  return _store.find((s) => s.id === id);
};

export const deleteSermon = async (id) => {
  _store = _store.filter((s) => s.id !== id);
};
