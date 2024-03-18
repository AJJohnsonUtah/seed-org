const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FileAttachmentSchema = new Schema(
  {
    name: String,
    contentType: String,
    size: Number,
    mimeType: String,
  },
  { timestamps: true }
);

const FileAttachmentModel = mongoose.model("FileAttachment", FileAttachmentSchema);
module.exports = { FileAttachmentSchema, FileAttachmentModel };
