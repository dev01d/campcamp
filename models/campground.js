var mongoose = require("mongoose");
// DB Schema
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

//  Create DB model
module.exports = mongoose.model("Campground", campgroundSchema); 