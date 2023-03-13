const express = require("express");
const rateLimit = require("express-rate-limit");
const validator = require("validator");

const app = express();
const PORT = process.env.PORT || 4040;
const redis = require("redis");
const { isValidUrl, isNullOrEmpty } = require("./Helper.js");

let redisClient;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

app.use(express.json());

(async () => {
  redisClient = redis.createClient({ url: process.env.REDIS_URL });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

app.get("/:value", apiLimiter, async (req, res) => {
  console.log("value is " + req.params.value);
  const value = await redisClient.get(req.params.value);

  if (!Object.is(value, null)) {
    console.log(value);

    res.redirect(301, value);
  } else {
    res.status(500).send("No Object Mapped");
  }
});

app.post("/add/insert", apiLimiter, async (req, res) => {
  console.log(`API is listening on get /add`);

  let userKey = req.body.key;
  let userValue = req.body.value;

  console.log("Key value is ", userKey);
  console.log("Value value is ", userValue);
  console.log("Url is ", validator.isURL(userValue));
  console.log("Key check ", isNullOrEmpty(userKey));

  if (validator.isURL(userValue) && !isNullOrEmpty(userKey)) {
    console.log(userValue);
    await redisClient.set(userKey, userValue);
    console.log(
      `Successfully inserted key '${userKey}'/value : '${userValue}' pair in Redis.`
    );
    res
      .status(200)
      .send(
        `Successfully inserted key \n '${userKey}' value : '${userValue}' \n pair in Redis.`
      );
  } else {
    res
      .status(400)
      .send(`Bad Request - key : '${userKey}'/value : '${userValue}'`);
  }
});

app.delete("/remove/:keyName", apiLimiter, async (req, res) => {
  const { keyName } = req.params;
  redisClient.del(keyName);
  res.status(200).send(`Deleted ${keyName} key`);
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
