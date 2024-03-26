const multer = require("multer");
require("./../db/userSchema");
// Multer storage configuration
const fileStorage = multer.memoryStorage();
const fileUpload = multer({ fileStorage });
const fs = require("node:fs");

const ATTACHMENT_BASE_PATH = process.env.NODE_ENV === "production" ? "/app-attachments" : "attachments";

function saveFileContent(path, filename, content) {
  fs.mkdirSync(path, { recursive: true });
  fs.writeFileSync(path + "/" + filename, content);
}

function deleteDirectory(dirToDelete) {
  fs.rmSync(dirToDelete, { recursive: true, force: true });
}

module.exports = { ATTACHMENT_BASE_PATH, saveFileContent, deleteDirectory, fileUpload };
