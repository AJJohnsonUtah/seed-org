import axios from "axios";

export const AUTH_BASE_URL = process.env.REACT_APP_API_PATH + "/auth";

const authAxiosInstance = axios.create();
authAxiosInstance.defaults.withCredentials = true;

export const AuthenticationService = {
  login: (email, password) => authAxiosInstance.post(AUTH_BASE_URL + "/login", { email, password }),
  verifyEmail: (_id, verificationCode) =>
  refreshToken: () => authAxiosInstance.get(AUTH_BASE_URL + "/refresh"),
  logout: () => authAxiosInstance.get(AUTH_BASE_URL + "/logout"),
};
