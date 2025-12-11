import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:6001/api/admin",
  withCredentials: true,
});

// ▓▓▓ REQUEST INTERCEPTOR ▓▓▓
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  // Skip token for auth routes
  if (
    config.url.includes("/login") ||
    config.url.includes("/register") ||
    config.url.includes("/forgot-password")
  ) {
    return config;
  }

  // Attach Authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ▓▓▓ RESPONSE INTERCEPTOR ▓▓▓
api.interceptors.response.use(
  (res) => {
    // Warn admin if token is near expiry
    if (res.headers["x-token-warning"] === "expiring-soon") {
      toast.warn("Your session will expire soon.");
    }
    return res;
  },

  (err) => {
    const status = err.response?.status;
    const code = err.response?.data?.code;
    const msg = err.response?.data?.message;

    // Session expired (auto logout)
    if (status === 401 || code === "TOKEN_EXPIRED" || code === "TOKEN_INVALID") {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
      return;
    }

    // Forbidden access
    if (status === 403) {
      toast.error("You do not have permission.");
    }

    // Missing token
    if (code === "NO_AUTH_HEADER") {
      toast.error("Authentication required.");
    }

    // Invalid format
    if (code === "INVALID_FORMAT") {
      toast.error("Invalid authentication token.");
    }

    // Generic API error
    if (msg) {
      toast.error(msg);
    }

    return Promise.reject(err);
  }
);


export default api;
