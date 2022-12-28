const express = require("express");
const rateLimit = require('express-rate-limit');


const app = express();
const PORT = process.env.PORT || 4040;
const redis = require("redis");
const {isValidUrl,isNullOrEmpty} = require("./Helper.js")

let variable = new Map([
  ["youtube", "https://www.youtube.com/?gl=IN"],
  ["netflix", "https://www.netflix.com/browse"],
  ["git", "https://github.com/Dhivakarkd?tab=repositories"],
]);
let redisClient;

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
})

app.use(express.json());


(async () => {
  redisClient = redis.createClient({ url: process.env.REDIS_URL });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();



app.get("/:value", apiLimiter,async (req, res) => {
  console.log("value is " + req.params.value);
  const value = await redisClient.get(req.params.value);

  if (!Object.is(value, null)) {
    console.log(value);

    res.redirect(301, value);
  } else {
    res.send(500, "No Object Mapped");
  }

  /*     redisClient.get(req.params.value, (err, reply) => {
        if (err) throw err;
    console.log("Value is "+reply)
        res.send(200, reply);
        // res.redirect(301, reply);
      }); */
});

app.post("/add/insert",apiLimiter, async (req, res) => {
  console.log(`API is listening on get /add`);

  if (isValidUrl(req.body.value) && isNullOrEmpty(req.body.key)) {
    console.log(req.body.value);
    await redisClient.set(req.body.key, req.body.value);
    res.send(200, req.body);
  }else{

    res.send(400,"Bad Request");

  }
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
