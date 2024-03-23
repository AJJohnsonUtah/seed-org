import axios from "axios";

export const FileAttachmentService = {
  getFileAttachments: () => axios.get(process.env.REACT_APP_API_PATH + "/fileAttachments").then((r) => r.data),
  saveFileAttachment: (fileAttachment) =>
    axios
      .post(process.env.REACT_APP_API_PATH + "/fileAttachments", fileAttachment, {
        headers: {
          "Content-Type": fileAttachment.type,
        },
      })
      .then((r) => r.data),
  deleteFileAttachmentById: (fileAttachmentId) =>
    axios.delete(process.env.REACT_APP_API_PATH + "/fileAttachments/" + fileAttachmentId).then((r) => r.data),
};
