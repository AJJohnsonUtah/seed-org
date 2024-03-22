import axios from "axios";

export const FileAttachmentService = {
  getFileAttachments: () => axios.get(process.env.REACT_APP_API_PATH + "/fileAttachments"),
  saveFileAttachment: (fileAttachment) =>
    axios
      .post(process.env.REACT_APP_API_PATH + "/fileAttachments", fileAttachment, {
        headers: {
          "Content-Type": fileAttachment.type,
        },
      })
      ,
  deleteFileAttachmentById: (fileAttachmentId) =>
    axios.delete(process.env.REACT_APP_API_PATH + "/fileAttachments/" + fileAttachmentId),
};
