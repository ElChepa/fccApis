var express = require("express");
var _ = require("lodash");
var hbs = require("hbs");

var {getTime} = require("./../middleware/timestep/m-timestep.js")
var Apirouter = express.Router();


// Timestep Microservice:
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
      item: "https://timestamp-ms.herokuapp.com/June%205%2C%202017"
    },{
      item: "https://timestamp-ms.herokuapp.com/1496613600000"
    }],
    output: [{
      item: '{ "natural": June 5, 2017, "unix": "1496613600000" }'
    }]
  })
});

Apirouter.get("/timestep-ms/:date", getTime, (req, res) => {

})

module.exports = {Apirouter}
