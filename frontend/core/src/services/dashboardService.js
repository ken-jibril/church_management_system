import api from "../axios.js";

export const getMembers = async () => {
  const res = await api.get("/members/");
  return res.data;
};

export const getActivities = async () => {
  const res = await api.get("/activities/");
  return res.data;
};

