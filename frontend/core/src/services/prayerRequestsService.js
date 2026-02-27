/**
 * Prayer Requests Service
 * NOTE: Backend does not yet have a prayer-requests endpoint.
 * Uses in-memory mock data. Replace with real API calls when available.
 */
import { mockPrayerRequests as _seed } from "./mockData";

let _store = [..._seed];

export const getPrayerRequests = async () => [..._store];

export const createPrayerRequest = async (payload) => {
  const item = { ...payload, id: Date.now(), prayedFor: 0 };
  _store = [item, ..._store];
  return item;
};

export const updatePrayerRequest = async (id, payload) => {
  _store = _store.map((p) => (p.id === id ? { ...p, ...payload } : p));
  return _store.find((p) => p.id === id);
};

export const deletePrayerRequest = async (id) => {
  _store = _store.filter((p) => p.id !== id);
};

export const incrementPrayedFor = async (id) => {
  _store = _store.map((p) =>
    p.id === id ? { ...p, prayedFor: (p.prayedFor || 0) + 1 } : p,
  );
  return _store.find((p) => p.id === id);
};
