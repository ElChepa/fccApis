require("./config/config.js");

var express = require("express");
var bodyParser = require("body-parser");
var _ = require("lodash");
var hbs = require("hbs");
var path = require("path");

var {Apirouter} = require("./routes/fcc-apis.js")

var port = process.env.PORT
var app = express();

app.set("views", "./server/views/")
app.set("view engine", "hbs")
app.enable('trust proxy');
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use("/fcc-apis", Apirouter);
app.use(express.static(__dirname + "public/google490532ae0b1a6152.html"))

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
