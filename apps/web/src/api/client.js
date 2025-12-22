import axios from "axios";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay
const TIMEOUT = 10000; // 10 seconds

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: TIMEOUT,
});

// Add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Exponential backoff delay calculation
const getRetryDelay = (retryCount) => {
  return RETRY_DELAY * Math.pow(2, retryCount);
};

// Check if error is retryable
const isRetryableError = (error) => {
  // Retry on network errors, timeouts, and 5xx server errors
  if (!error.response) return true; // Network error
  if (error.code === 'ECONNABORTED') return true; // Timeout
  if (error.response.status >= 500) return true; // Server error
  return false;
};

// Sleep utility for retry delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Handle token refresh on 401 errors and implement retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token refresh)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Only redirect if it's actually a refresh token failure (not network issues)
        if (refreshError.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Retry logic for network errors and server errors
    const retryCount = originalRequest.__retryCount || 0;

    if (isRetryableError(error) && retryCount < MAX_RETRIES) {
      originalRequest.__retryCount = retryCount + 1;

      // Wait with exponential backoff before retrying
      await sleep(getRetryDelay(retryCount));

      return apiClient(originalRequest);
    }

    // Enhance error messages for better user feedback
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please check your connection and try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your internet connection.';
    } else if (error.response.status >= 500) {
      error.message = 'Server error. Please try again later.';
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
