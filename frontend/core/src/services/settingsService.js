/**
 * Settings Service
 * NOTE: Backend does not yet have a settings endpoint.
 * Uses mock data. Replace with real API calls when available.
 */
import { mockSettings as _seed } from "./mockData";

let _store = { ..._seed };

export const getSettings = async () => ({ ..._store });

export const updateSettings = async (section, payload) => {
  _store = { ..._store, [section]: { ..._store[section], ...payload } };
  return { ..._store };
};
