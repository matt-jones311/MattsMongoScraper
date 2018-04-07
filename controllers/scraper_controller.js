var express = require("express");

var router = express.Router();

var request = require("request");

var cheerio = require("cheerio");

var mongoose = require("mongoose");

//Set monsoose to leverage built in Javascript ES6 Promises

mongoose.Promise = Promise;

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

router.get("/", function(req, res){
    res.render("index");
});

//This will get the articles scraped and saved in the db and show them in the list.
router.get("/savedarticles", function(req, res){

    //Grabs every doc in the Articles array
    Article.find({}, function(error, doc) {
        //logs errors
        if (error) {
            console.log(error);
        }
        //Or send the doc to the browser as a json object
        else {
            var hbsArticleObject = {
                articles: doc
            };

            res.render("savedarticles", hbsArticleObject);
        }
    });
});

// a GET request to scrape the echojs website
router.post("/scrape", function(req, res) {

    //first grab the body of the html with request
    request("http:www.nytimes.com/", function(error, response, html) {
        //Then, we load that into cheerio and save it to $ for a shorhand selector
        var $ = cheerio.load(html);

        //Make empty array for temporarily saving and showing scraped articles.
        var scrapedArticles = {};

        //Now, we grab every h2 in an article tag, and do the following:
        $("article h2").each(function(i, element) {

            //save an empty result object
            var result = {};

            //add the text and href of the link, and save them as properties of the result object
            result.title = $(this).children("a").attr("href");

            console.log("What's the result title ?" + result.title);

            result.link = $(this).children("a").attr("href");

            scrapedArticles[i] = result;

        });

        console.log("Scraped Articles object built nicely: " + scrapedArticles);

        var hbsArticleObject = {
            articles: scrapedArticles
        };

        res.render("index", hbsArticleObject) {

            console.log
        }
    })
})