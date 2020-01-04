"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var shortId = require("shortid");
var validUrl = require("valid-url");
var URLModel = require("./models/URLModel");

var cors = require("cors");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose
  .connect(process.env.MONGOLAB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Database Connected..."))
  .catch(error => {
    console.log("Not Connected...");
    console.log(error);
  });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.post("/api/shorturl/new", function(req, res) {
  const url = req.body.url;

  if (validUrl.isUri(url)) {
    URLModel.findOne({ original_url: url }, (error, doc) => {
      if (error) res.json({ error });

      if (doc) {
        res.json({
          original_url: doc.original_url,
          short_url: doc.short_url
        });
      } else {
        var new_url = new URLModel({
          original_url: url,
          short_url: shortId.generate()
        });
        new_url.save();
        res.json({
          original_url: new_url.original_url,
          short_url: new_url.short_url
        });
      }
    });
  } else {
    res.json({ error: "invalid URL" });
  }
});

app.get("/api/shorturl/:short_url", function(req, res) {
  var short_url = req.params.short_url;

  URLModel.findOne({ short_url }, (error, doc) => {
    if (error) res.json({ error: "invalid URL" });

    if (doc) {
      res.redirect(doc.original_url);
    }
  });
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
