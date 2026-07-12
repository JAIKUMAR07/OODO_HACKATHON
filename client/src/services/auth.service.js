import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("transitops_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const forgotPasswordRequest = (email) => API.post("/auth/forgot-password", { email });
export const verifyOtpRequest = (email, otp) => API.post("/auth/verify-otp", { email, otp });
export const resetPasswordRequest = (email, otp, newPassword) =>
  API.post("/auth/reset-password", { email, otp, newPassword });
