import axios from "axios";

export const LOGIN_BASE_URL = process.env.REACT_APP_API_PATH + "/auth";

export const UserService = {
  getCurrentAuthUser: () => axios.get(LOGIN_BASE_URL + "/currentUser").then((r) => r.data),
};
