const mongoose = require("mongoose");
const { FileAttachmentSchema } = require("./fileAttachmentSchema");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: String,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    attachments: [FileAttachmentSchema],
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("Comment", CommentSchema);
module.exports = { CommentSchema, CommentModel };
