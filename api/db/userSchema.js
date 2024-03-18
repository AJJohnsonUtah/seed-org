const mongoose = require("mongoose");
const { FileAttachmentSchema } = require("./fileAttachmentSchema");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: String,
    password: String,
    profilePic: FileAttachmentSchema,
    displayName: String,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = { UserSchema, UserModel };
