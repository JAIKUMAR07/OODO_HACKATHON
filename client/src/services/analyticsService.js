import api from "./api.js";

export const getAnalyticsSummary = async () => {
  const response = await api.get(`/reports/summary`);
  return response.data;
};

export const exportAnalyticsCSV = async () => {
  const response = await api.get(`/reports/export/csv`, {
    responseType: "blob", // Important for downloading files
  });
  return response.data;
};
