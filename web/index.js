const express = require("express");
const rateLimit = require("express-rate-limit");
const validator = require("validator");

const app = express();
const PORT = process.env.PORT || 4040;
const redis = require("redis");
const { isValidUrl, isNullOrEmpty } = require("./Helper.js");

let redisClient;

app.set("view engine", "ejs");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

function checkRedisConnection(req, res, next) {
  console.log("Health Check");
  //FIXME : Fix Error handling for health check 
  redisClient.ping((err, result) => {
    if (err) {
      res.status(500).send("Redis connection error");
    }
  });
  next();
}

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use(express.static("views"));

(async () => {
  redisClient = redis.createClient({ url: process.env.REDIS_URL });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

// Render the form page
app.get("/main/home", (req, res) => {
  const defaults = {
    key: res.body.value,
  };
  res.render("form", { defaults });
});

app.get("/:value", apiLimiter, async (req, res) => {
  console.log("value is " + req.params.value);
  const value = await redisClient.get(req.params.value);

  if (!Object.is(value, null)) {
    console.log(value);

    res.redirect(301, value);
  } else {
    const defaults = {
      value: req.params.value,
    };

    console.log(defaults);
    res.render("form", { defaults });
  }
});

app.post("/add/insert", apiLimiter, async (req, res) => {
  console.log(`API is listening on get /add`);

  let keyName = req.body.key;
  let UrlPath = req.body.url;

  console.log("Key value is ", keyName);
  console.log("Value value is ", UrlPath);
  console.log("Url is ", validator.isURL(UrlPath));
  console.log("Key check ", isNullOrEmpty(keyName));

  if (validator.isURL(UrlPath) && !isNullOrEmpty(keyName)) {
    console.log(UrlPath);
    await redisClient.set(keyName, UrlPath);
    const defaults = {
      key:req.body.key,
      value: req.body.url,
    };
    console.log(
      `Successfully inserted key '${keyName}'/value : '${UrlPath}' pair in Redis.`
    );
    res.render("success",{defaults});
  } else {
    res
      .status(400)
      .send(`Bad Request - key : '${keyName}'/value : '${UrlPath}'`);
  }
});

app.delete("/remove/:keyName", apiLimiter, async (req, res) => {
  const { keyName } = req.params;
  redisClient.del(keyName);
  console.log(`Deleted ${keyName} key`);
  res.status(200).send(`Deleted ${keyName} key`);
});

app.get("/get/healthcheck", apiLimiter, checkRedisConnection, (req, res) => {
  res.status(200).send("API is up and running");
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
