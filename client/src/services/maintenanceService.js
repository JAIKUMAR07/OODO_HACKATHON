import api from "./api.js";

export const getMaintenanceLogs = async (query = {}) => {
  const params = new URLSearchParams(query).toString();
  const response = await api.get(`/maintenance?${params}`);
  return response.data.logs || [];
};

export const createMaintenanceLog = async (logData) => {
  const response = await api.post("/maintenance", logData);
  return response.data;
};

export const closeMaintenanceLog = async (id, costData = {}) => {
  const response = await api.patch(`/maintenance/${id}/close`, costData);
  return response.data;
};
