import axios from "axios";

export const AUTH_BASE_URL = process.env.REACT_APP_API_PATH + "/auth";

const authAxiosInstance = axios.create();
authAxiosInstance.defaults.withCredentials = true;

export const AuthenticationService = {
  login: (email, password) => authAxiosInstance.post(AUTH_BASE_URL + "/login", { email, password }).then((r) => r.data),
  signup: (email, password, displayName) =>
    authAxiosInstance.post(AUTH_BASE_URL + "/newUser", { email, password, displayName }).then((r) => r.data),
  verifyEmail: (_id, verificationCode) =>
    authAxiosInstance.post(AUTH_BASE_URL + "/verifyEmail", { verificationCode, _id }).then((r) => r.data),
  refreshToken: () => authAxiosInstance.get(AUTH_BASE_URL + "/refresh").then((r) => r.data),
  logout: () => authAxiosInstance.get(AUTH_BASE_URL + "/logout"),
};
