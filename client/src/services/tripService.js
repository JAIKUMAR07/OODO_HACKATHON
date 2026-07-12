import api from "./api.js";

export const getTrips = async (params = {}) => {
  const response = await api.get("/trips", { params });
  return response.data.trips || [];
};

export const createDraftTrip = async (tripData) => {
  const response = await api.post("/trips", tripData);
  return response.data;
};

export const assignTrip = async (id, assignmentData) => {
  const response = await api.post(`/trips/${id}/assign`, assignmentData);
  return response.data;
};

export const dispatchTrip = async (id) => {
  const response = await api.post(`/trips/${id}/dispatch`);
  return response.data;
};

export const completeTrip = async (id, completionData) => {
  const response = await api.post(`/trips/${id}/complete`, completionData);
  return response.data;
};

export const cancelTrip = async (id) => {
  const response = await api.post(`/trips/${id}/cancel`);
  return response.data;
};
