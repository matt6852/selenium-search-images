const minioClient = require("../application/sendImageToCloud");
const path = require("path");
const Resize = require("../midleware/resize");
const {
  parseYandexImages,
  parseGoogleImages,
} = require("../application/parseResulet");

const uploadImgController = async (req, res) => {
  try {
    const imagePath = path.resolve("src/uploads");
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      res.status(401).json({ error: "Please provide an image" });
    }
    const filename = await fileUpload.save(req.file.buffer);

    const file = fileUpload.filepath(filename);
    // const metaData = {
    //   "Content-Type": "application/octet-stream",
    //   "X-Amz-Meta-Testing": 1234,
    //   example: 5678,
    // };
    // const bucket = await minioClient.makeBucket("test-1", "us-east-1");
    const result = await minioClient.fPutObject("test", filename, file);
    if (result.etag) {
      const listGoogle = await parseGoogleImages(filename);
      const listYandex = await parseYandexImages(filename);

      return res
        .status(200)
        .json({ name: filename, listOfData: [...listYandex, ...listGoogle] });
    }

    console.log(result);
  } catch (error) {
    console.log(error, "SERVER ERROR!");
    res.status(400).json({ error: "SERVER ERROR!", msg: error });
  }
};

module.exports = {
  uploadImgController,
};
