/**
 * Donations Service
 * Connects to backend API at /donations/donations/
 */
import api from "../api/axios";

export const getDonations = async () => {
  try {
    const res = await api.get("/donations/donations/");
    const data = Array.isArray(res.data) ? res.data : res.data.results || [];
    return data;
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
};

export const createDonation = async (payload) => {
  try {
    const res = await api.post("/donations/donations/", payload);
    return res.data;
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
};

export const updateDonation = async (id, payload) => {
  try {
    const res = await api.patch(`/donations/donations/${id}/`, payload);
    return res.data;
  } catch (error) {
    console.error('Error updating donation:', error);
    throw error;
  }
};

export const deleteDonation = async (id) => {
  try {
    await api.delete(`/donations/donations/${id}/`);
  } catch (error) {
    console.error('Error deleting donation:', error);
    throw error;
  }
};
