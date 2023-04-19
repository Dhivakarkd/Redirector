const express = require("express");
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const dbUtils = require("./dbUtils");
const db = require("./database").db;
const categoryCache = require("./database").getCategories;
const log4js = require("log4js");
log4js.configure("log4js.json");
const escape = require("escape-html");
const multer = require("multer");
const fs = require("fs");

const logger = log4js.getLogger();

var favicon = require("serve-favicon");
var path = require("path");
const app = express();
app.use(favicon(path.join(__dirname, "views/images", "favicon.ico")));
const PORT = process.env.PORT || 4040;
const redis = require("redis");
const { isValidUrl, isNullOrEmpty } = require("./Helper.js");

app.set("view engine", "ejs");

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

app.get("/", (req, res) => {
  const defaults = {
    value: res.body?.value || null,
    dropdownValues: categoryCache(),
  };
  res.render("form", { defaults });
});

// Render the form page
app.get("/view/setting", (req, res) => {
  var userSettings = {
    name: "John Doe",
    email: "john.doe@example.com",
    notifications: true,
  };
  res.render("setting", { userSettings: userSettings });
});

app.post("/action/export", apiLimiter, async (req, res) => {
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

app.post("/action/import", upload.single("file"), apiLimiter, (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    res.status(400).send("Bad Request");
    return;
  }

  // Read the uploaded file and parse the JSON data
  const fileContents = fs.readFileSync(req.file.path, "utf-8");
  const jsonData = JSON.parse(fileContents);
  console.log(jsonData);

  dbUtils.insertImportData(jsonData);

  var userSettings = {
    name: "John Doe",
    email: "john.doe@example.com",
    notifications: true,
  };
  res.render("setting", { userSettings: userSettings });
});

app.get("/:value", apiLimiter, (req, res) => {
  logger.info("value is " + req.params.value);

  dbUtils
    .getUrlByKey(req.params.value)
    .then((url) => {
      if (!Object.is(url, null)) {
        logger.info(req.params.value);
        res.redirect(301, url.url);
      } else {
        const defaults = {
          value: req.params.value,
          dropdownValues: categoryCache(),
        };
        logger.info(defaults);
        res.render("form", { defaults });
      }
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send("Internal Server Error");
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

    dbUtils
      .insertUrl(urlData)
      .then((data) => {
        const defaults = {
          key: data.key,
          value: data.url,
        };
        logger.info(
          `Successfully inserted key '${keyName}'/value : '${UrlPath}' in Database.`
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
        `Bad Request - key : '${encodedKeyName}'/value : '${encodedUrlPath}'`
      );
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
