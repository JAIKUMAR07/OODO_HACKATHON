import api from "./api.js";

export const getVehicles = async (query = {}) => {
  const params = new URLSearchParams(query).toString();
  const response = await api.get(`/vehicles?${params}`);
  return response.data.vehicles || []; // Array of vehicles
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post("/vehicles", vehicleData);
  return response.data;
};

export const updateVehicleStatus = async (id, status) => {
  const response = await api.put(`/vehicles/${id}`, { status });
  return response.data;
};
