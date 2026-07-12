import api from "./api.js";

export const getDrivers = async () => {
  const response = await api.get("/drivers");
  return response.data.drivers || []; // Array of drivers
};

export const createDriver = async (driverData) => {
  const response = await api.post("/drivers", driverData);
  return response.data;
};

export const updateDriverStatus = async (id, status) => {
  const response = await api.patch(`/drivers/${id}/status`, { status });
  return response.data;
};
