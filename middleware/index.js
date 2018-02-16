var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = {};

// Check ownership of campground
middleware.checkCampgroundOwner = (req, res, next) => {
  if (req.isAuthenticated) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
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
    req.flash("error", "Please Login First");
    res.redirect("back");
  }
};

// Check ownership of campground post
middleware.checkCommentOwner = (req, res, next) => {
  if (req.isAuthenticated) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash("error", "Comment not found.");
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
    req.flash("error", "Please Login First");
    res.redirect("back");
  }
};

// Check logged in middleware
middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login First");
  res.redirect("/login");
};

module.exports = middleware;