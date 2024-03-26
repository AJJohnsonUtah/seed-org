var express = require("express");
const { UserModel } = require("../db/userSchema");
const { ATTACHMENT_BASE_PATH, fileUpload, saveFileContent } = require("../common/fileHandlers");
const sharp = require("sharp");
var router = express.Router();

/* GET users listing. */
router.get("/current", async function (req, res, next) {
  const curUser = req.user;
  const loggedInUser = await UserModel.findById(curUser._id).select("-hashedPassword").populate("organizations");
  res.send(loggedInUser);
});

/* POST base comment attachment*/
router.post("/uploadProfilePic", fileUpload.single("file"), async function (req, res) {
  const resizedImage = await sharp(req.file.buffer).resize(150, 150, { fit: "cover" }).withMetadata().toBuffer();
  const dbAttachment = {
    name: req.file.originalname,
    contentType: req.file.contentType,
    size: resizedImage.byteLength,
    mimeType: req.file.mimetype,
  };
  UserModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        profilePic: dbAttachment,
      },
    },
    { new: true }
  ).then((updatedUser) => {
    const newAttachment = updatedUser.profilePic;
    saveFileContent(
      `${ATTACHMENT_BASE_PATH}/profilePic/${req.user._id}/${updatedUser.profilePic._id}`,
      newAttachment.name,
      resizedImage
    );
    res.send(updatedUser);
  });
});

/* GET base comment attachment buffer*/
router.get("/profilePic/:_id/:_profilePicId/:fileName", async function (req, res) {
  const path = require("path");
  const pathToFile = path.resolve(
    `${ATTACHMENT_BASE_PATH}/profilePic/${req.params._id}/${req.params._profilePicId}/${req.params.fileName}`
  );
  res.sendFile(pathToFile);
});

module.exports = router;
