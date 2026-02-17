import api from "../api/axios.js";

export const getMembers = async () => {
  const res = await api.get("/members/all/");
  return res.data;
};

export const getActivities = async () => {
  const res = await api.get("/events/");
  return res.data;
};

