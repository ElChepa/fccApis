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
      item: "https://nouri-hilscher-apis.herokuapp.com/fcc-apis/timestep-ms/June%205%2C%202017"
    },{
      item: "https://nouri-hilscher-apis.herokuapp.com/fcc-apis/timestep-ms/1496613600000"
    }],
    output: [{
      item: '{ "natural": June 5, 2017, "unix": "1496613600000" }'
    }]
  })
});

Apirouter.get("/timestep-ms/:date", getTime, (req, res) => {

})

Apirouter.get("/whoami", (req, res) => {
  res.render("apis.hbs", {
    pageTitle: "Request Header Parser Microservice",
    userStorys: [{
      item: "1) I can get the IP address for my browser."
    },{
      item: "2) I can get the language for my browser."
    },{
      item: "3) I can get the operating system for my browser."
    }],
    usage: [{
      item: "https://nouri-hilscher-apis.herokuapp.com/fcc-apis/whoami/me"
    }],
    output: [{
      item: '{"ipaddress":"10.11.111.111","language":"de-DE","software":"Macintosh; Intel Mac OS X 10_12_5"}'
    }]
  })
});

Apirouter.get("/whoami/me", (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.replace(/:(?=\d)/, "%%%").split("%%%")[1];
  var language = req.get("Accept-Language").replace(/,/gi, " ").split(" ")[0];
  var software = req.get("user-agent").replace(/\u0028/, "%%%").replace(/\u0029/, "%%%").split("%%%")[1].replace(/%%%\gi/, "");
  res.send({
    ip,
    language,
    software
  })
});

module.exports = {Apirouter}
