const mongoose = require("mongoose");
const { FileAttachmentSchema } = require("./fileAttachmentSchema");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: String,
    hashedPassword: String,
    profilePic: FileAttachmentSchema,
    displayName: String,
    accountVerification: {
      verified: Boolean,
      verificationDate: String, // UTC Date String
      verificationCodeExpirationDate: String, // UTC Date String
      verificationCode: String,
    },
    organizations: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = { UserSchema, UserModel };
