const express = require("express");
const router = express.Router();

const dbUtils = require("../../dbUtils");

router.get("/urls", (req, res) => {
  const category = req.query.category;

  dbUtils
    .getUrlByCategory(category)
    .then((urls) => {
      res.status(200).send(urls);
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send("Internal Server Error");
    });
});

// app.delete("/remove/:keyName", apiLimiter, async (req, res) => {
//   const { keyName } = req.params;
//   redisClient.del(keyName);
//   logger.info(`Deleted ${keyName} key`);
//   res.status(200).send(`Deleted ${keyName} key`);
// });

// app.get("/get/healthcheck", apiLimiter, checkRedisConnection, (req, res) => {
//   res.status(200).send("API is up and running");
// });

module.exports = router;
