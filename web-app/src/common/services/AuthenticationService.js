import axios from "axios";

export const LOGIN_BASE_URL = process.env.REACT_APP_API_PATH + "/auth";

export const AuthenticationService = {
  login: (email, password) => axios.post(LOGIN_BASE_URL + "/login", { email, password }).then((r) => r.data),
};
