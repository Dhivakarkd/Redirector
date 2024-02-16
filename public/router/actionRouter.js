const express = require("express");
const router = express.Router();

const dbUtils = require("../../dbUtils");
const escape = require("escape-html");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const log4js = require("log4js");
const logger = log4js.getLogger();
const validator = require("validator");
const { isNullOrEmpty } = require("../../Helper.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "db/"); // Save uploaded files to the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

// Create a Multer instance with the defined storage
const upload = multer({ storage });

router.post("/export", async (req, res) => {
  try {
    const data = await dbUtils.getExportData();
    res.setHeader("Content-disposition", "attachment; filename=data.json");
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error exporting data");
  }
});

router.post("/import", upload.single("file"), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    res.status(400).send("Bad Request");
    return;
  }

  // Sanitize the file path
  const filePath = path.normalize(req.file.path);

  // Read the uploaded file and parse the JSON data
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(fileContents);
  console.log(jsonData);

  dbUtils
    .insertImportData(jsonData)
    .then(() => {
      res.status(200).send();
    })
    .catch((error) => {
      logger.error(error.message);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/insert", (req, res) => {
  let keyName = req.body.key;
  let UrlPath = req.body.url;

  const urlData = {
    key: req.body.key,
    url: req.body.url,
    category: req.body.dropdown,
    customvalue: req.body.customValue,
  };

  if (validator.isURL(UrlPath) && !isNullOrEmpty(keyName)) {
    logger.info(UrlPath);

    dbUtils
      .insertUrl(urlData)
      .then((data) => {
        const defaults = {
          key: data.key,
          value: data.url,
        };
        logger.info(
          `Successfully inserted key '${keyName}'/ Value : '${UrlPath}' in Database.`
        );
        res.render("success", { defaults });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send("Internal Server Error");
      });
  } else {
    const encodedKeyName = escape(keyName);
    const encodedUrlPath = escape(UrlPath);

    res
      .status(400)
      .send(
        `Bad Request - key : '${encodedKeyName}'/ Value : '${encodedUrlPath}'`
      );
  }
});

module.exports = router;
