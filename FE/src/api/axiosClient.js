import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://sdn302-zc12.onrender.com/",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize response errors so frontend can display consistent backend messages
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const resp = error.response;
    const normalized = {
      success: resp?.data?.success ?? false,
      status: resp?.data?.status ?? resp?.status ?? 500,
      // prefer structured message from backend, then fallback to http statusText or axios message
      message:
        resp?.data?.message ||
        resp?.data?.error ||
        resp?.statusText ||
        error.message,
      // include any structured error payload (could contain stack in development)
      details: resp?.data?.error ?? resp?.data ?? null,
      raw: resp?.data ?? null,
    };

    // Attach normalized payload to the error object for consumers
    error.normalized = normalized;

    // Log on client console in dev for debugging
    try {
      if (import.meta?.env?.DEV) {
        console.error("API Error (normalized):", normalized);
      }
    } catch {
      // ignore when import.meta is not available
    }

    return Promise.reject(error);
  }
);
export default axiosClient;
