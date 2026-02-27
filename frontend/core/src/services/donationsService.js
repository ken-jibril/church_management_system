/**
 * Donations Service
 * NOTE: The backend does not yet have a donations endpoint.
 * This service uses local in-memory state seeded from mockData.
 * When the backend adds /donations/ endpoints, replace the mock
 * implementations with real api.get/post/patch/delete calls.
 */
import { mockDonations as _seed } from "./mockData";

// In-memory store (survives re-renders within a session)
let _store = [..._seed];

export const getDonations = async () => {
  return [..._store];
};

export const createDonation = async (payload) => {
  const item = {
    ...payload,
    id: Date.now(),
    amount: parseFloat(payload.amount) || 0,
  };
  _store = [item, ..._store];
  return item;
};

export const updateDonation = async (id, payload) => {
  _store = _store.map((d) =>
    d.id === id
      ? { ...d, ...payload, amount: parseFloat(payload.amount) || d.amount }
      : d,
  );
  return _store.find((d) => d.id === id);
};

export const deleteDonation = async (id) => {
  _store = _store.filter((d) => d.id !== id);
};
