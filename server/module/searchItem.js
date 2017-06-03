var mongoose = require("mongoose");

var searchSchema = new mongoose.Schema({
  searchText: {
    required: true,
    type: String
  },
  time: {
    required: true,
    type: Number
  }
})

searchSchema.statics.findRecentSearches = function(){
  var Search = this;
  return Search.find({}).sort({time: -1}).limit(10).then((results) => {
    var resultArray = [];
    var index = 1
    results.forEach((item) => {
      resultArray.push({index, searchString: item.searchText});
      index += 1;
    })
    return Promise.resolve(resultArray);
  }).catch((e) => {
    return Promise.reject();
  })
}

searchSchema.pre("save", function(next){
  Search.find({}).sort({time: -1}).then((results) => {
    if(results.length > 20){
      var i = results.length
      var removeFunction = function(){
        if (i > 20){
           Search.remove({time: results[i - 1].time}).then(() => {
             i -= 1
             removeFunction()
           })
        } else {
          return next()
        }
      }
      removeFunction();
    }
    return next()
  })
});

var Search = mongoose.model("Search", searchSchema);

module.exports = {Search}
