const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "db/database.db");

const log4js = require("log4js");
const logger = log4js.getLogger();

let categoriesCache = [];

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error(err.message);
  }
  logger.info("Connected to the database.");
  init();
});

// Perform database operations here

const createTables = () => {
  logger.info("Inserting Tables");
  db.exec(
    `
        CREATE TABLE IF NOT EXISTS
        categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT UNIQUE NOT NULL
        );

    CREATE TABLE IF NOT EXISTS
        urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            url TEXT UNIQUE NOT NULL,
            category TEXT NOT NULL,
            expiry_date TEXT,
            created_timestamp TEXT NOT NULL,
            FOREIGN KEY (category) REFERENCES categories (category)
        );

    CREATE INDEX IF NOT EXISTS idx_urls_key ON urls (key);

    CREATE INDEX IF NOT EXISTS idx_urls_category ON urls (category);

    CREATE INDEX IF NOT EXISTS idx_urls_expiry_date ON urls (expiry_date);

   
INSERT INTO categories (category) VALUES ('Quick Links');
INSERT INTO categories (category) VALUES ('Projects');
`,
    (err) => {
      if (err) {
        logger.error(err.message);
      } else {
        logger.info("Tables created successfully!");
      }
    }
  );

  // Add more table creation statements here if necessary
};

function init() {
  logger.info("Init Called");

  createTables();

  updateCategoriesCache();
}

function updateCategoriesCache() {
  db.all("SELECT * FROM categories", function (err, rows) {
    if (err) {
      logger.error(err);
      return;
    }
    categoriesCache = rows;
  });
  logger.info("Categories Cache Updated");
}

function getCategories() {
  let categories = categoriesCache
    .map((category) => category.category)
    .concat("Custom");
  return categories;
}

module.exports = { db, updateCategoriesCache, getCategories };
