const express = require('express');
const cheerio = require('cheerio');
const rp = require('request-promise');
const router = express.Router();
const db = require('../models');
var axios = require("axios");

// ROUTE: /scrape

router.get('/', function (req, res) {
  console.log("This is working so far!")
  axios.get("https://www.reddit.com/r/politics/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $('span.y8HYJ-y_lTUHkQIc1mdCq').each(function (i, element) {
      var result = {};

      result.title = $(this).children('a').text().trim();

      result.link = $(this).children('a').attr('href');

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send('/');
  });
})

module.exports = router;