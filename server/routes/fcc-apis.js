var express = require("express");
var _ = require("lodash");
var hbs = require("hbs");
var Hashkit = require("hashkit");
var hashkit = new Hashkit();
var isUrl = require("is-url");

var {mongoose} = require("./../db/mongoose.js")
var {getTime} = require("./../middleware/timestep/m-timestep.js");
var {Url} = require("./../module/url.js")
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
  var ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;
  var language = req.get("Accept-Language").replace(/,/gi, " ").split(" ")[0];
  var software = req.get("user-agent").replace(/\u0028/, "%%%").replace(/\u0029/, "%%%").split("%%%")[1].replace(/%%%\gi/, "");
  res.send({
    ip,
    language,
    software
  })
});

Apirouter.get("/shortify", (req, res) => {
  res.render("apis.hbs", {
    pageTitle: "URL Shortener Microservice",
    userStorys: [{
      item: "1) I can pass a URL as a parameter and I will receive a shortened URL in the JSON response."
    },{
      item: "2)  If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead."
    }, {
      item: "3) When I visit that shortened URL, it will redirect me to my original link."
    }],
    usage: [{
      item: "https://nouri-hilscher-apis.herokuapp.com/fcc-apis/shortify/new/http://www.example.com"
    }],
    output: [{
      item: '{original: "http://www.example.com", shortUrl: "https://nouri-hilscher-apis.herokuapp.com/fcc-apis/shortify/Avoxo3A"}'
    }]
  })
})

Apirouter.get("/shortify/new/*", (req, res) => {
  var time = new Date().getTime();
  var url = req.params[0];
  if (isUrl(url)){
  var shortId = hashkit.encode(time)
  var shortUrl = `${process.env.SHORTENERURL}/${shortId}`;
  Url.findOne({url}).then((urlObject) => {
    if(urlObject){
      return res.send({
        original: urlObject.url,
        shortUrl: urlObject.shortUrl
      })
    } else {
      var newUrlObject = new Url({time, url, shortUrl, shortId});
      newUrlObject.save().then((url) => {
        res.send({
          original: url.url,
          shortUrl: url.shortUrl
        })
    })
  }
  }).catch((e) => {
      res.status(400).send();
    });
  } else {
    res.status(400).send({
      error: "Invalid Url"
    })
  }
});

Apirouter.get("/shortify/:urlId", (req, res) => {
  var shortId = req.params.urlId;
  Url.findOne({shortId}).then((urlObject) => {
    if (!urlObject){
      return res.status(404).send();
    }
    res.redirect(urlObject.url);
  }).catch((e) => {
    return res.status(404).send();
  })
})

module.exports = {Apirouter}
