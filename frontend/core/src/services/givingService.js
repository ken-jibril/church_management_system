/**
 * Giving Service
 * Connects to backend API at /donations/giving/
 */
import api from "../api/axios";

export const getGiving = async () => {
  try {
    const res = await api.get("/donations/giving/");
    const data = Array.isArray(res.data) ? res.data : res.data.results || [];
    return data;
  } catch (error) {
    console.error("Error fetching giving:", error);
    return [];
  }
};

export const createGiving = async (payload) => {
  try {
    const res = await api.post("/donations/giving/", payload);
    return res.data;
  } catch (error) {
    console.error("Error creating giving:", error);
    throw error;
  }
};

export const updateGiving = async (id, payload) => {
  try {
    const res = await api.patch(`/donations/giving/${id}/`, payload);
    return res.data;
  } catch (error) {
    console.error("Error updating giving:", error);
    throw error;
  }
};

export const deleteGiving = async (id) => {
  try {
    await api.delete(`/donations/giving/${id}/`);
  } catch (error) {
    console.error("Error deleting giving:", error);
    throw error;
  }
};
