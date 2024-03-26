import axios from "axios";

export const USERS_BASE_URL = process.env.REACT_APP_API_PATH + "/users";

export const UserService = {
  getCurrentAuthUser: () => axios.get(USERS_BASE_URL + "/current").then((r) => r.data),
  uploadProfilePic: (attachment) => {
    const file = attachment;
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(USERS_BASE_URL + "/uploadProfilePic", formData).then((r) => r.data);
  },
  getSrcUrlForProfilePic: (user) =>
    user?.profilePic
      ? `${USERS_BASE_URL}/profilePic/${user._id}/${user.profilePic._id}/${user.profilePic.name}`
      : undefined,
};
