import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Add request interceptor to include access token from NextAuth session
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export const refreshAccessToken = async () => {
  try {
    const session = await getSession();
    if (!session?.refreshToken) {
      return { success: false, error: "No refresh token available" };
    }

    const response = await apiClient.post(
      "/api/users/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${session.refreshToken}`,
        },
      }
    );

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
      // NextAuth will handle token refresh automatically
      // Just retry the request once
      return apiCall(config, retryCount + 1);
    }

    // If still getting 401 after retry, redirect to login
    if (error.response?.status === 401 && retryCount > 0) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      throw new Error("Authentication failed");
    }

    // For 400 errors (validation errors), let the calling function handle them
    // Don't throw these errors as they are expected and should be handled gracefully
    if (error.response?.status === 400) {
      throw error; // Still throw 400 errors so they can be caught by the calling function
    }

    // For other errors, throw them
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
