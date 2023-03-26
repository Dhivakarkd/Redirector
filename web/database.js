const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "db/database.db");

let categoriesCache = [];

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
  init();
});

// Perform database operations here

const createTables = () => {
  console.log("Inserting Tables");
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

   
INSERT INTO categories (category) VALUES ('News');
INSERT INTO categories (category) VALUES ('Sports');
INSERT INTO categories (category) VALUES ('Technology');
INSERT INTO categories (category) VALUES ('Entertainment');
INSERT INTO categories (category) VALUES ('Science');


INSERT INTO urls (key, url, category, expiry_date, created_timestamp) VALUES ('Google', 'https://www.google.com/', 'Technology', '2023-04-30', '2022-03-26 12:34:56');
INSERT INTO urls (key, url, category, expiry_date, created_timestamp) VALUES ('Yahoo', 'https://www.yahoo.com/', 'News', '2023-05-15', '2022-03-26 12:35:10');
INSERT INTO urls (key, url, category, expiry_date, created_timestamp) VALUES ('CNN', 'https://www.cnn.com/', 'News', '2023-05-10', '2022-03-26 12:36:24');
INSERT INTO urls (key, url, category, expiry_date, created_timestamp) VALUES ('ESPN', 'https://www.espn.com/', 'Sports', '2023-04-28', '2022-03-26 12:37:05');
INSERT INTO urls (key, url, category, expiry_date, created_timestamp) VALUES ('YouTube', 'https://www.youtube.com/', 'Entertainment', '2023-06-01', '2022-03-26 12:38:19');
INSERT INTO urls (key, url, category, expiry_date, created_timestamp) VALUES ('NASA', 'https://www.nasa.gov/', 'Science', '2023-05-31', '2022-03-26 12:39:44');
  `,
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Tables created successfully!");
      }
    }
  );

  // Add more table creation statements here if necessary
};

function init() {
  console.log("Init Called");

  createTables();

  updateCategoriesCache();
}

function updateCategoriesCache() {
  db.all("SELECT * FROM categories", function (err, rows) {
    if (err) {
      console.error(err);
      return;
    }
    categoriesCache = rows;
  });
  console.log("Categories Cache Updated");
}

function getCategories() {
  let categories = categoriesCache
    .map((category) => category.category)
    .concat("Custom");
  return categories;
}

module.exports = { db, updateCategoriesCache, getCategories };
