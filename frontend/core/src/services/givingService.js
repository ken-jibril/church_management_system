/**
 * Giving Service
 * NOTE: Backend does not yet have a giving endpoint.
 * Uses in-memory mock data. Replace with real API calls when available.
 */
import { mockGiving as _seed } from "./mockData";

let _store = [..._seed];

export const getGiving = async () => [..._store];

export const createGiving = async (payload) => {
  const item = {
    ...payload,
    id: Date.now(),
    amount: parseFloat(payload.amount) || 0,
  };
  _store = [item, ..._store];
  return item;
};

export const updateGiving = async (id, payload) => {
  _store = _store.map((g) =>
    g.id === id
      ? { ...g, ...payload, amount: parseFloat(payload.amount) || g.amount }
      : g,
  );
  return _store.find((g) => g.id === id);
};

export const deleteGiving = async (id) => {
  _store = _store.filter((g) => g.id !== id);
};
