const express = require("express");

const app = express();
const PORT = process.env.PORT || 4040;
const redis = require("redis");

let variable = new Map([
    ["youtube", "https://www.youtube.com/?gl=IN"],
    ["netflix", "https://www.netflix.com/browse"],
    ["git", "https://github.com/Dhivakarkd?tab=repositories"],
]);
let redisClient;

(async () => {
    redisClient = redis.createClient({url: process.env.REDIS_URL});

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

ap
app.use(express.json());

app.get("/:value", async (req, res) => {
    console.log("value is " + req.params.value);
    const value = await redisClient.get(req.params.value)
    console.log(value);
    res.send(200, value);
    /*     redisClient.get(req.params.value, (err, reply) => {
        if (err) throw err;
    console.log("Value is "+reply)
        res.send(200, reply);
        // res.redirect(301, reply);
      }); */
});

app.post("/add/insert", async (req, res) => {
    console.log(`API is listening on get /add`);
    console.log(req.body.value);
    await redisClient.set(req.body.key, req.body.value);
    res.send(200, req.body);
});

app.get("/nothing/no", async (req, res) => {
    console.log("Inside nothing")

    await redisClient.keys('*', function (err, keys) {
        if (err) return console.log(err);

        for (var i = 0, len = keys.length; i < len; i++) {
            console.log(keys[i]);
        }
    });
});

app.listen(PORT, () => {
    console.log(`API is listening on port ${PORT}`);
});
