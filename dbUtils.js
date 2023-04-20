const db = require("./database").db;
const util = require("util");
const run = util.promisify(db.run.bind(db));
const all = util.promisify(db.all.bind(db));
const get = util.promisify(db.get.bind(db));

const updateCategoriesCache = require("./database").updateCategoriesCache;
const getCache = require("./database").getCategories;
const { Url, mapRowToUrl } = require("./models/Url");
const { Category } = require("./models/Category");

const log4js = require("log4js");
const logger = log4js.getLogger();

function rowsToJSON(rows) {
  // Convert rows to JSON string
  const jsonString = JSON.stringify(rows);

  // Parse JSON string into JavaScript object
  const jsonObject = JSON.parse(jsonString);

  return jsonObject;
}

function getUrlByCategory(category) {
  let sql = "SELECT * FROM urls";
  const params = [];

  if (category !== "ALL") {
    sql += " WHERE category = ?";
    params.push(category);
  }

  return all(sql, params).then((rows) => {
    const urls = rows.map((row) => mapRowToUrl(row));
    return urls;
  });
}

function getUrlByKey(key) {
  const sql = "SELECT url FROM urls WHERE key = ?";
  return get(sql, [key]).then((row) => {
    if (!row) {
      return null;
    }
    const url = {
      url: row.url,
    };
    return url;
  });
}

async function getExportData() {
  const sql = "SELECT key, url , category FROM urls";
  const rows = await all(sql);
  return JSON.stringify(rows);
}

function insertImportData(jsonData) {
  return new Promise((resolve, reject) => {
    const cache = getCache();

    for (const row of jsonData) {
      const { key, url, category } = row;

      // Insert category in category table, and add it to the cache if it doesn't exist
      const sqlCategory = "INSERT INTO category (name) VALUES (?)";
      const paramsCategory = [category];

      if (!cache.includes(category)) {
        try {
          run("INSERT INTO categories (category) VALUES (?)", category);
          cache.push(category);
        } catch (err) {
          console.error(err.message);
          reject(err);
        }
      }

      // Insert url in url table
      insertNewUrl(key, url, category)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error(err.message);
          reject(err);
        });
    }
    updateCategoriesCache();
  });
}

function insertUrl(urlData) {
  // Destructure the input object
  const { key, url, category, customvalue } = urlData;

  if (category === "Custom") {
    const newCategory = new Category(null, customvalue);
    return run(
      "INSERT INTO categories (category) VALUES (?)",
      newCategory.category
    ).then(() => {
      updateCategoriesCache();
      return insertNewUrl(key, url, newCategory.category);
    });
  } else {
    return insertNewUrl(key, url, category);
  }
}

function insertNewUrl(key, url, category) {
  const newUrl = new Url(
    null,
    key,
    url,
    category,
    null,
    new Date().toISOString()
  );
  return run(
    "INSERT INTO urls (key, url, category, created_timestamp) VALUES (?, ?, ?, ?)",
    [newUrl.key, newUrl.url, newUrl.category, newUrl.created_timestamp]
  ).then(() => {
    // Return the newly inserted Url object
    return newUrl;
  });
}

module.exports = {
  rowsToJSON,
  getUrlByKey,
  getExportData,
  insertUrl,
  getUrlByCategory,
  insertImportData,
};
