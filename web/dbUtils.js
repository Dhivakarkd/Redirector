const db = require("./database").db;
const updateCategoriesCache = require("./database").updateCategoriesCache;
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

function getUrlByCategory(category, callback) {
  let sql = "SELECT * FROM urls";
  const params = [];

  if (category !== "ALL") {
    sql += " WHERE category = ?";
    params.push(category);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      callback(err);
    } else {
      const urls = rows.map((row) => mapRowToUrl(row));
      callback(null, urls);
    }
  });
}

function getUrlByKey(key, callback) {
  const sql = "SELECT url FROM urls WHERE key = ?";
  db.get(sql, [key], (err, row) => {
    if (err) {
      return callback(err);
    }
    // const url = {
    //   id: row.id,
    //   key: row.key,
    //   url: row.url,
    //   category: row.category,
    //   expiry_date: row.expiry_date,
    //   created_timestamp: row.created_timestamp
    // };

    if (!row) {
      return callback(null, null);
    }
    const url = {
      url: row.url,
    };
    callback(null, url);
  });
}

function insertUrl(urlData, callback) {
  // Destructure the input object
  const { key, url, category, customvalue } = urlData;
  if (category === "Custom") {
    const newCategory = new Category(null, customvalue);
    db.run(
      "INSERT INTO categories (category) VALUES (?)",
      newCategory.category,
      function (err) {
        if (err) {
          return callback(err);
        }
        updateCategoriesCache();
        insertNewUrl(key, url, newCategory.category, callback);
      }
    );
  } else {
    insertNewUrl(key, url, category, callback);
  }
}

function insertNewUrl(key, url, category, callback) {
  const newUrl = new Url(
    null,
    key,
    url,
    category,
    null,
    new Date().toISOString()
  );
  db.run(
    "INSERT INTO urls (key, url, category, created_timestamp) VALUES (?, ?, ?, ?)",
    [newUrl.key, newUrl.url, newUrl.category, newUrl.created_timestamp],
    function (err) {
      if (err) {
        return callback(err);
      }
      // Return the newly inserted Url object
      callback(null, newUrl);
    }
  );
}

module.exports = { rowsToJSON, getUrlByKey, insertUrl, getUrlByCategory };
