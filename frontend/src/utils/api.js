import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

export const refreshAccessToken = async () => {
  try {
    const response = await apiClient.post("/api/users/refresh");

    if (response.data.status === "success") {
      return {
        success: true,
        accessToken: response.data.data.accessToken,
        user: response.data.data.user,
      };
    }

    return { success: false, error: "Token refresh failed" };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Token refresh failed",
    };
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiClient.post("/api/users/logout");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Logout failed",
    };
  }
};

export const apiCall = async (config, retryCount = 0) => {
  try {
    const response = await apiClient(config);
    return response;
  } catch (error) {
    // If access token expired and we haven't retried yet
    if (error.response?.status === 401 && retryCount === 0) {
      const refreshResult = await refreshAccessToken();

      if (refreshResult.success) {
        // Retry the original request
        return apiCall(config, retryCount + 1);
      } else {
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
        throw new Error("Authentication failed");
      }
    }

    throw error;
  }
};

// Convenience methods
export const api = {
  get: (url, config = {}) => apiCall({ ...config, method: "GET", url }),
  post: (url, data, config = {}) =>
    apiCall({ ...config, method: "POST", url, data }),
  put: (url, data, config = {}) =>
    apiCall({ ...config, method: "PUT", url, data }),
  delete: (url, config = {}) => apiCall({ ...config, method: "DELETE", url }),
};

export default api;
