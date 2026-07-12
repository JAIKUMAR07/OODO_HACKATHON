import axios from "axios";

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return "http://localhost:5000/api";
  return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

// Create an Axios instance
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});


// Request Interceptor: Attach token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("transitops_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle global errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and force logout on 401 Unauthorized
      localStorage.removeItem("transitops_token");
      localStorage.removeItem("transitops_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
