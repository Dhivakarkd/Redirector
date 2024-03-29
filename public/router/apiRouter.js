const express = require("express");
const router = express.Router();
const log4js = require("log4js");
const logger = log4js.getLogger();

const dbUtils = require("../../dbUtils");

router.get("/urls", async (req, res) => {
  const category = req.query.category;
  const start = parseInt(req.query.start) || 0; // Default start index to 0 if not provided
  const end = parseInt(req.query.end) || 10; // Default end index to 10 if not provided

  try {
    // Fetch total count
    const totalCountPromise = dbUtils.getTotalCountByCategory(category);
    const totalCount = await totalCountPromise;

    logger.info("Total Count is : ", totalCount);

    // Fetch URLs
    const urlsDataPromise = dbUtils.getUrlByCategory(category, start, end);
    const urlsData = await urlsDataPromise;

    // logger.info("Url Data is : ", urlsData);

    // Construct response object including URLs and total count
    const responseData = {
      totalCount,
      urls: urlsData,
    };

    // Send response
    res.status(200).send(responseData);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/urls/:id", (req, res) => {
  const id = req.params.id;
  dbUtils
    .deleteUrlById(id)
    .then(() => {
      res.status(200).send("URL deleted successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Failed to delete URL");
    });
});

module.exports = router;
