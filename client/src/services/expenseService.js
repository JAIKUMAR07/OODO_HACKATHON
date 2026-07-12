import api from "./api.js";

export const getFuelLogs = async (query = {}) => {
  const params = new URLSearchParams(query).toString();
  const response = await api.get(`/expenses/fuel?${params}`);
  return response.data.fuelLogs || [];
};

export const createFuelLog = async (logData) => {
  const response = await api.post("/expenses/fuel", logData);
  return response.data;
};

export const getExpenses = async (query = {}) => {
  const params = new URLSearchParams(query).toString();
  const response = await api.get(`/expenses?${params}`);
  return response.data.expenses || [];
};

export const createExpense = async (expenseData) => {
  const response = await api.post("/expenses", expenseData);
  return response.data;
};
