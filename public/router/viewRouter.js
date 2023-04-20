const express = require("express");
const router = express.Router();

const categoryCache = require("../../database").getCategories;

router.get("/home", (req, res) => {
  const defaults = {
    value: res.body?.value || null,
    dropdownValues: categoryCache(),
  };
  res.render("form", { defaults });
});

router.get("/setting", (req, res) => {
  var userSettings = {
    name: "John Doe",
    email: "john.doe@example.com",
    notifications: true,
  };
  res.render("setting", { userSettings: userSettings });
});

// GET route for the EJS page
router.get("/indexes", (req, res) => {
  // get all categories from the database
  let categories = categoryCache();

  categories.pop(); // remove the last element ("Custom")
  categories.push("ALL"); // add "ALL" to the end of the array

  let selectedCategory;
  // render the EJS page with the rows and categories data
  res.render("Categories", { categories, selectedCategory });
});

module.exports = router;
