const request = require("request");

var getSearchData = function(searchString, page){
  return new Promise((resolve, reject) => {
    request({
      url: `${process.env.IMG_SEARCH}q=${searchString}&start=${page * 10}`,
      json: true
    }, (error, response, body) => {
      if (error || response.statusCode !== 200){
        reject("Unable to search")
      } else {
        var results = [];
        body.items.forEach((item) => {
          results.push({
            url: item.link,
            thumbnail: item.image.thumbnailLink,
            snippet: item.snippet,
            context: item.image.contextLink
          })
        })
        resolve(results);
      }
    })
  })
}

module.exports = {getSearchData};
