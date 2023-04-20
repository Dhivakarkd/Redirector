const express = require("express");
const rateLimit = require("express-rate-limit");
const dbUtils = require("./dbUtils");
const db = require("./database").db;
const categoryCache = require("./database").getCategories;
const log4js = require("log4js");
log4js.configure("log4js.json");

const mime = require("mime");

const viewRouter = require("./public/router/viewRouter");
const actionRouter = require("./public/router/actionRouter");
const apiRouter = require("./public/router/apiRouter");

const logger = log4js.getLogger();

var favicon = require("serve-favicon");
var path = require("path");
const app = express();
app.use(favicon(path.join(__dirname, "public/images", "favicon.ico")));
const PORT = process.env.PORT || 4040;

app.set("view engine", "ejs");

// // Set MIME type for .js files
// mime.define({
//   "application/javascript": ["js"],
// });

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use(apiLimiter);

// app.use(
//   express.static(path.join(__dirname, "views"), {
//     setHeaders: (res, filePath) => {
//       const ext = path.extname(filePath);
//       if (ext === ".js") {
//         res.setHeader("Content-Type", "text/javascript");
//       }
//     },
//   })
// );

app.use(express.static(path.join(__dirname, "public")));

app.use("/view", viewRouter);
app.use("/action", actionRouter);
app.use("/get", apiRouter);

app.get("/", (req, res) => {
  const defaults = {
    value: res.body?.value || null,
    dropdownValues: categoryCache(),
  };
  res.render("form", { defaults });
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

app.listen(PORT, () => {
  logger.info(`Redirector is Up`);
});
