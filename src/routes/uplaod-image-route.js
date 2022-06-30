const express = require("express");

const imageRouter = express.Router();
const { uploadImgController } = require("../controllers/image-controller");
const { upload } = require("../midleware/handle-image-midleware");

imageRouter
  .route("/upload")
  .get(async (req, res, next) => res.send("Hellow world"))
  .post(upload.single("image"), uploadImgController);
// .post((req) => {
//  console.log();
// })

module.exports = imageRouter;
