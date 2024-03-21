function addCommentEndpointsForModel(router, BaseModel) {
  const mongoose = require("mongoose");
  const multer = require("multer");
  require("./../db/userSchema");
  // Multer storage configuration
  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  const fs = require("node:fs");

  const ATTACHMENT_BASE_PATH = process.env.NODE_ENV === "production" ? "/app-attachments" : "attachments";

  function saveAttachmentContent(path, filename, content) {
    fs.mkdirSync(path, { recursive: true });
    fs.writeFileSync(path + "/" + filename, content);
  }

  function getUserForComment() {
    return {
      _id: "65ef43e0e63612181a7508a1",
      email: "AJJohnsonUtah@gmail.com",
      displayName: "AJ Johnson",
    };
  }

  async function getBaseComments(_id, includeAttachments) {
    return await BaseModel.findById(_id).select("-comments.attachments.buffer").populate("comments.user");
  }

  /* GET base comments */
  router.get("/:_id/comments", async function (req, res, next) {
    res.send(await getBaseComments(req.params._id));
  });

  /* POST new base comment */
  router.post("/:_id/comments", async function (req, res, next) {
    const baseWithComments = await getBaseComments(req.params._id);
    req.body.user = getUserForComment();
    baseWithComments.comments.push(req.body);
    res.send(await baseWithComments.save());
  });

  /* PUT base comment attachment*/
  router.put("/:_id/comments/:_commentId", async function (req, res, next) {
    req.body.user = getUserForComment();
    let result = await BaseModel.findByIdAndUpdate(
      req.params._id,
      {
        $set: {
          "comments.$[inner].content": req.body.content,
        },
      },
      {
        arrayFilters: [{ "inner._id": req.params._commentId }],
        new: true,
      }
    ).populate("comments.user");
    res.send(result);
  });

  /* DELETE base comment*/
  router.delete("/:_id/comments/:_commentId", function (req, res, next) {
    try {
      const dirToDelete = `${ATTACHMENT_BASE_PATH}/${req.params._id}/${req.params._commentId}`;
      fs.rmSync(dirToDelete, { recursive: true, force: true });
    } catch (err) {
      if (!err.message.includes("no such file or directory")) {
        throw err;
      } else {
        console.warn("No attachments to remove");
      }
    }
    BaseModel.findByIdAndUpdate(
      req.params._id,
      {
        $pull: {
          comments: { _id: req.params._commentId },
        },
      },
      {
        new: true,
      }
    ).then(() => res.sendStatus(204));
  });

  /* POST base comment attachment*/
  router.post("/:_id/comments/:_commentId/fileAttachment", upload.single("file"), async function (req, res) {
    const dbAttachment = {
      name: req.file.originalname,
      contentType: req.file.contentType,
      size: req.file.size,
      mimeType: req.file.mimetype,
    };
    BaseModel.findOneAndUpdate(
      { _id: req.params._id, "comments._id": req.params._commentId },
      {
        $push: {
          "comments.$.attachments": dbAttachment,
        },
      },
      { new: true }
    )
      .populate("comments.user")
      .then((updatedBase) => {
        const updatedComment = updatedBase.comments.find((c) => c._id.equals(req.params._commentId));
        const newAttachment = updatedComment.attachments[updatedComment.attachments.length - 1];
        saveAttachmentContent(
          `${ATTACHMENT_BASE_PATH}/${req.params._id}/${req.params._commentId}/${newAttachment._id}`,
          newAttachment.name,
          req.file.buffer
        );
        res.send(updatedBase);
      });
  });

  /* GET base comment attachment buffer*/
  router.get("/:_id/comments/:_commentId/fileAttachment/:_attachmentId/:fileName", async function (req, res) {
    const path = require("path");
    const pathToFile = path.resolve(
      `${ATTACHMENT_BASE_PATH}/${req.params._id}/${req.params._commentId}/${req.params._attachmentId}/${req.params.fileName}`
    );
    res.sendFile(pathToFile);
  });
}

module.exports = addCommentEndpointsForModel;
