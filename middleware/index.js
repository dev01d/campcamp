var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = {};

// Check ownership of campground
middleware.checkCampgroundOwner = (req, res, next) => {
  if (req.isAuthenticated) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

// Check ownership of campground post
middleware.checkCommentOwner = (req, res, next) => {
  if (req.isAuthenticated) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};


// Check logged in middleware
middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middleware;