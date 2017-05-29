var mongoose = require("mongoose");

var UrlSchema = new mongoose.Schema({
  time: {
    required: true,
    type: Number
  },
  url: {
    type: String,
    minlength: 1
  },
  shortUrl: {
    type: String,
    required: true
  }
});

UrlSchema.statics.findByShortUrl = function(shortUrl){
  var Url = this;
  return Url.findOne({shortUrl}).then((url) => {
    if(!url){
      return Promise.reject();
    }
    return Promise.resolve(url.url);
  })
};

UrlSchema.statics.checkUrl = function(url){
  var Url = this;
  return Url.findOne({url}).then((url) => {
    if (!url){
      return Promise.resolve();
    }
    return Promise.reject({
      url : url.url,
      shortUrl: url.shortUrl
    });
  })
};

var Url = mongoose.model("Url", UrlSchema)

module.exports = {Url}
