const express = require("express");
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const dbUtils = require("./dbUtils");
const db = require("./database").db;
const categoryCache = require("./database").getCategories;
const log4js = require("log4js");
log4js.configure("log4js.json");

const logger = log4js.getLogger();

var favicon = require("serve-favicon");
var path = require("path");
const app = express();
app.use(favicon(path.join(__dirname, "views/images", "favicon.ico")));
const PORT = process.env.PORT || 4040;
const redis = require("redis");
const { isValidUrl, isNullOrEmpty } = require("./Helper.js");

app.set("view engine", "ejs");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use(
  express.static("views", {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "text/javascript");
      }
    },
  })
);

// Render the form page
app.get("/main/home", (req, res) => {
  const defaults = {
    value: res.body?.value || null,
    dropdownValues: categoryCache(),
  };
  res.render("form", { defaults });
});

app.get("/:value", apiLimiter, (req, res) => {
  logger.info("value is " + req.params.value);

  dbUtils.getUrlByKey(req.params.value, (err, data) => {
    if (err) {
      logger.error(err.message);
      res.status(500).send("Internal Server Error");
    }
    if (!Object.is(data, null)) {
      logger.info(req.params.value);

      res.redirect(301, data.url);
    } else {
      const defaults = {
        value: req.params.value,
        dropdownValues: categoryCache(),
      };

      logger.info(defaults);
      res.render("form", { defaults });
    }
  });
});

app.get("/get/all", apiLimiter, (req, res) => {
  db.all(
    `
  SELECT * FROM urls
`,
    [],
    (err, rows) => {
      if (err) {
        throw err;
      }

      // Convert rows to JSON and send as response
      const jsonObject = dbUtils.rowsToJSON(rows);
      res.json(jsonObject);
    }
  );
});

// GET route for the EJS page
app.get("/view/indexes", apiLimiter, (req, res) => {
  // get all categories from the database
  let categories = categoryCache();

  categories.pop(); // remove the last element ("Custom")
  categories.push("ALL"); // add "ALL" to the end of the array

  let selectedCategory;
  // render the EJS page with the rows and categories data
  res.render("Categories", { categories, selectedCategory });
});

app.get("/get/urls", apiLimiter, (req, res) => {
  const category = req.query.category;

  dbUtils.getUrlByCategory(category, (err, urls) => {
    if (err) {
      logger.error(err.message);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send(urls);
    }
  });
});

app.post("/add/insert", apiLimiter, (req, res) => {
  logger.info(`API is listening on get /add`);

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

    dbUtils.insertUrl(urlData, (err, data) => {
      if (err) {
        logger.error(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        const defaults = {
          key: data.key,
          value: data.url,
        };
        logger.info(
          `Successfully inserted key '${keyName}'/value : '${UrlPath}' in Database.`
        );
        res.render("success", { defaults });
      }
    });
  } else {
    res
      .status(400)
      .send(`Bad Request - key : '${keyName}'/value : '${UrlPath}'`);
  }
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

app.listen(PORT, () => {
  logger.info(`Redirector is Up`);
});
