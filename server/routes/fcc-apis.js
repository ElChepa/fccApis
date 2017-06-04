var express = require("express");
var _ = require("lodash");
var hbs = require("hbs");
var Hashkit = require("hashkit");
var hashkit = new Hashkit();
var isUrl = require("is-url");
var multer = require("multer");
var upload = multer();

var {mongoose} = require("./../db/mongoose.js")
var {getTime} = require("./../middleware/timestep/m-timestep.js");
var {getSearchData} = require("./../middleware/imageSearch/gRequest.js");
var {Url} = require("./../module/url.js")
var {Search} = require("./../module/searchItem.js")
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
    }, {
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
    }, {
      item: "2) I can get the language for my browser."
    }, {
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
    }, {
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
  if (isUrl(url)) {
    var shortId = hashkit.encode(time)
    var shortUrl = `${process.env.SHORTENERURL}/${shortId}`;
    Url.findOne({
      url
    }).then((urlObject) => {
      if (urlObject) {
        return res.send({
          original: urlObject.url,
          shortUrl: urlObject.shortUrl
        })
      } else {
        var newUrlObject = new Url({
          time,
          url,
          shortUrl,
          shortId
        });
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
  Url.findOne({
    shortId
  }).then((urlObject) => {
    if (!urlObject) {
      return res.status(404).send();
    }
    res.redirect(urlObject.url);
  }).catch((e) => {
    return res.status(404).send();
  })
})

Apirouter.get("/imagu", (req, res) => {
  res.render("apis.hbs", {
    pageTitle: "Image Search Abstraction Layer",
    userStorys: [{
      item: "1) I can get the image URLs, alt text and page urls for a set of images relating to a given search string."
    }, {
      item: "2) I can paginate through the responses by adding a ?offset=2 parameter to the URL."
    }, {
      item: "3) I can get a list of the most recently submitted search strings."
    }],
    usage: [{
      item: "https://nouri-hilscher-apis.herokuapp.com/fcc-apis/imagu/lolcats%20funny?offset=2"
    }, {
      item: "https://nouri-hilscher-apis.herokuapp.com/fcc-apis/imagu/history"
    }],
    output: [{
      item: `{
url: "https://s-media-cache-ak0.pinimg.com/originals/aa/b4/ba/aab4baf0faf37acd36abe1403fa304c8.jpg",
thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLLyOSNmTA-97DH2gQiNgjtkCowZXF7qRZpqdPceVyt6bzfCMPLJ3g-h4p",
snippet: "54-LOLCAts-funny-cats.jpg (500×325) | Lolcats | Pinterest | Cats ...",
context: "https://www.pinterest.com/pin/533606255824804443/"
}...`
    }, {
      item: `{
index: 0,
searchString: "lolcats funny"
}...`
    }]
  })
})

Apirouter.get("/imagu/history", (req, res) => {
  Search.findRecentSearches().then((results) => {
    res.send(results);
  }).catch((e) => {
    res.status(400).send();
  })
});

Apirouter.get("/imagu/:items", (req, res) => {
  var params = decodeURIComponent(req.params.items).split("?");
  var searchTerms = encodeURIComponent(params[0]);
  var site = params[1] ? params[1].match(/\d+/)[0] : 1;
  var newSearch = new Search({
    searchText: params[0],
    time: new Date().getTime()
  })
  newSearch.save().then((result) => {
    getSearchData(searchTerms, site).then((results) => {
      res.status(200).send(results)
    }).catch((e) => {
      res.status(400).send();
    })
  })
})

Apirouter.get("/fileData", (req, res) => {
  res.render("apis.hbs", {
    pageTitle: "File Metadata Microservice",
    userStorys: [{
      item: "1) I can submit a FormData object that includes a file upload."
    }, {
      item: "2) When I submit something, I will receive the file size in bytes within the JSON response"
    }],
    usage: [{
      item: "https://nouri-hilscher-apis.herokuapp.com/fcc-apis/fileData/upload"
    }],
    output: [{
      item: `{size: 22514}`
    }]
  })
})

Apirouter.get("/fileData/upload", (req, res) => {
  res.render("uploadForm.hbs");
});

Apirouter.post("/fileData/upload/meta", upload.single("file"), (req, res) => {
  var size = req.file.size;
  res.send({
    size
  })
})

module.exports = {
  Apirouter
}
