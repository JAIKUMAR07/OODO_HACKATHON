import api from "./api.js";

export const getDashboardKPIs = async () => {
  const response = await api.get("/dashboard/kpis");
  return response.data;
};

export const getVehicleStatus = async () => {
  const response = await api.get("/dashboard/vehicle-status");
  return response.data;
};

export const getRecentVehicles = async (limit = 5) => {
  const response = await api.get(`/dashboard/recent-vehicles?limit=${limit}`);
  return response.data;
};
