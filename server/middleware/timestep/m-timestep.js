var moment = require("moment");

var getTime = (req, res, next) => {
 var date = req.params.date;
 var decode = decodeURIComponent(date);
 if (moment(decode, "x", true).isValid() || moment(decode, "X", true).isValid()){
   var dateObject = {
     natural: moment.unix(decode).format("MMMM D, YYYY"),
     unix: decode
   }
   res.status(200).send(dateObject);
   next()
 } else if (moment(decode, "MMMM D, YYYY").isValid() || moment(decode, "MMMM Do, YYYY").isValid()){
   var dateObject = {
     natural: moment(decode, "MMMM D, YYYY").format("MMMM D, YYYY"),
     unix: moment(decode, "MMMM D, YYYY").format("x")
   }
   res.status(200).send(dateObject);
   next()
 } else {
   res.status(400).send()
 }

}

module.exports = {
  getTime
}
