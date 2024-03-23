const mongoose = require("mongoose");
const { FileAttachmentSchema } = require("./fileAttachmentSchema");

const Schema = mongoose.Schema;

const OrganizationSchema = new Schema(
  {
    name: String,
    type: String,
    logo: FileAttachmentSchema,
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        role: [String],
      },
    ],
  },
  { timestamps: true }
);

const OrganizationModel = mongoose.model("Organization", OrganizationSchema);
module.exports = { OrganizationSchema, OrganizationModel };
