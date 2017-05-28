var express = require("express");
var _ = require("lodash");
var hbs = require("hbs");

var Apirouter = express.Router();


Apirouter.get("/timestep-ms", (req, res) => {
  res.render("apis.hbs", {
    pageTitle: "Timestep Microservice",
    userStorys: [{
      item: "1) I can pass a string as a parameter, and it will check to see whether that string contains either a unix timestamp or a natural language date (example: January 1, 2016)."
    }, {
      item: "2) If it does, it returns both the Unix timestamp and the natural language form of that date."
    }, {
      item: "3) If it does not contain a date or Unix timestamp, it returns null for those properties."
    }],
    usage: [{
      item: "https://timestamp-ms.herokuapp.com/December%2015,%202015"
    },{
      item: "https://timestamp-ms.herokuapp.com/1450137600"
    }],
    output: [{
      item: '{ "unix": 1450137600, "natural": "December 15, 2015" }'
    }]
  })
});

Apirouter.get("/timestep-ms/:date", (req, res) => {

})

module.exports = {Apirouter}
