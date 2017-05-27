require("./config/config.js");

var express = require("express");
var bodyParser = require("body-parser");
var _ = require("lodash");

var port = process.env.PORT
var app = express();

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
