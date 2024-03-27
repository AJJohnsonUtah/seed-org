import axios from "axios";

export const ORG_BASE_URL = process.env.REACT_APP_API_PATH + "/organizations";

export const OrganizationService = {
  getOrganizationInfo: (orgId) => axios.get(ORG_BASE_URL + "/" + orgId).then((r) => r.data),
  addOrganization: (organization) => axios.post(ORG_BASE_URL, organization).then((r) => r.data),
  updateOrganization: (organization) =>
    axios.put(ORG_BASE_URL + "/" + organization._id, organization).then((r) => r.data),
  inviteCollaborator: (orgId, email) =>
    axios.post(ORG_BASE_URL + "/" + orgId + "/addMember", { email }).then((r) => r.data),
  revokeInvite: (orgId, email) =>
    axios.post(ORG_BASE_URL + "/" + orgId + "/revokeInvite", { email }).then((r) => r.data),
  removeMember: (orgId, userId) =>
    axios.delete(ORG_BASE_URL + "/" + orgId + "/removeMember/" + userId).then((r) => r.data),
};
