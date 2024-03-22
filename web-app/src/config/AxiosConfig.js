import axios from "axios";
import { AuthenticationService } from "../common/services/AuthenticationService";

// Function to refresh the authentication token
const refreshAuthToken = async (originalRequest) => {
  try {
    // Make a request to your server's refresh token endpoint
    await AuthenticationService.refreshToken();

    // Retry the original request that resulted in a 401 response
    return axios.request(originalRequest);
  } catch (error) {
    // Handle refresh token failure or other errors
    throw error;
  }
};

export function setupAxiosDefaults() {
  axios.defaults.withCredentials = true;

  // Add response interceptor to handle 401 responses
  axios.interceptors.response.use(
    // Default to returning the data from any successful response. Cleans up services nicely
    (r) => r.data,
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh the authentication token
          const response = await refreshAuthToken(originalRequest);
          return response;
        } catch (refreshError) {
          // Handle refresh token failure or other errors
          throw refreshError;
        }
      } else if (error?.response?.status === 403) {
        // We're trying to do something hella sketch....... log 'em out and have 'em try again maybe?
        window.globalLogout();
      }

      // Return any other errors without modification
      return Promise.reject(error);
    }
  );
}
