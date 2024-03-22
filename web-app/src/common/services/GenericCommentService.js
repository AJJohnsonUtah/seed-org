import axios from "axios";

export function getCommentFunctions(BASE_URL) {
  return {
    getComments: (_id) => axios.get(BASE_URL + "/" + _id + "/comments"),
    editComment: (_id, commentIdx, comment) =>
      axios.put(BASE_URL + "/" + _id + "/comments/" + commentIdx, comment),
    addComment: (_id, comment) => axios.post(BASE_URL + "/" + _id + "/comments", comment),
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
        ;
    },
    getCommentAttachmentBuffer: (_id, _commentId, _attachmentId) =>
      axios.get(`${BASE_URL}/${_id}/comments/${_commentId}/fileAttachment/${_attachmentId}`),
    deleteCommentById: (_id, _commentId) =>
      axios.delete(BASE_URL + "/" + _id + "/comments/" + _commentId),
    getSrcUrlForAttachment: (_id, _commentId, _attachmentId, fileName) =>
      `${BASE_URL}/${_id}/comments/${_commentId}/fileAttachment/${_attachmentId}/${fileName}`,
  };
}
