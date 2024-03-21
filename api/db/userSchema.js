const mongoose = require("mongoose");
const { FileAttachmentSchema } = require("./fileAttachmentSchema");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: String,
    hashedPassword: String,
    profilePic: FileAttachmentSchema,
    displayName: String,
    accountStatus: String,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = { UserSchema, UserModel };
