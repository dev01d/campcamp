var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// New comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

// Create comment
router.post("/", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Oops! Something went wrong.");
          console.log(err);
        } else {
          // Add UN and ID to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment._id);
          campground.save();
          req.flash("success", "Created comment!");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// EDIT comment
router.get("/:comment_id/edit", middleware.checkCommentOwner, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err || !foundCampground) {
      req.flash("error", "Campground not found");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          campground_id: req.params.id,
          comment: foundComment
        });
      }
    });
  });
});

// UPDATE comment
router.put("/:comment_id", middleware.checkCommentOwner, (req, res) => {
  Comment.findOneAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("success", "Comment updated!");
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

// DESTROY comment
router.delete("/:comment_id", middleware.checkCommentOwner, (req, res) => {
  Comment.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Removed comment!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
