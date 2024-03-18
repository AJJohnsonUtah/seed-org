import axios from "axios";

export function getCommentFunctions(BASE_URL) {
  return {
    getComments: (_id) => axios.get(BASE_URL + "/" + _id + "/comments").then((r) => r.data),
    editComment: (_id, commentIdx, comment) =>
      axios.put(BASE_URL + "/" + _id + "/comments/" + commentIdx, comment).then((r) => r.data),
    addComment: (_id, comment) => axios.post(BASE_URL + "/" + _id + "/comments", comment).then((r) => r.data),
    addCommentAttachment: (_id, _commentId, attachment) => {
      const file = attachment;
      const formData = new FormData();

      formData.append("file", file);
      return axios
        .post(BASE_URL + "/" + _id + "/comments/" + _commentId + "/fileAttachment", formData, {
          headers: {
            // "Content-Type": "multipart/form-data",
          },
        })
        .then((r) => r.data);
    },
    getCommentAttachmentBuffer: (_id, _commentId, _attachmentId) =>
      axios.get(`${BASE_URL}/${_id}/comments/${_commentId}/fileAttachment/${_attachmentId}`).then((r) => r.data),
    deleteCommentById: (_id, _commentId) =>
      axios.delete(BASE_URL + "/" + _id + "/comments/" + _commentId).then((r) => r.data),
    getSrcUrlForAttachment: (_id, _commentId, _attachmentId, fileName) =>
      `${BASE_URL}/${_id}/comments/${_commentId}/fileAttachment/${_attachmentId}/${fileName}`,
  };
}
