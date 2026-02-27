/**
 * Reports Service
 * NOTE: Backend does not yet have a reports endpoint.
 * Uses mock data. Replace with real API calls when available.
 */
import { mockReports as _seed } from "./mockData";

export const getReports = async () => ({ ..._seed });
