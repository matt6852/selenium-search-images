const express = require("express");
const app = express();
const parseYandexImages = require("./application/parseResulet");
const imageRouter = require("./routes/uplaod-image-route");
const bodyParser = require("body-parser");

app.use(express.static("./src/public"));
const port = process.env.PORT || 7777;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/", imageRouter);
const start = async () => {
  try {
    // await parseYandexImages();
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}`)
    );
  } catch (error) {
    console.log(error, "Error!!!");
  }
};

start();
