var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX -Display CGs
router.get("/", (req, res) => {
  //  get all CGs
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      req.flash("error", "Oops! Something went wrong.");
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - Adding a new CG
router.post("/", middleware.isLoggedIn, (req, res) => {
  // get data from form & add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price = req.body.price;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author
  };
  // create new CG and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
      req.flash("error", "Campground not found");
    } else {
      req.flash("success", "New campground created!");
      res.redirect("/campgrounds");
    }
  });
});

// NEW - show form to create new CGs
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// SHOW - shows more info about a CG
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        console.log(err);
        res.redirect("back");
      } else {
        // render SHOW with that ID
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// EDIT campground
router.get("/:id/edit", middleware.checkCampgroundOwner, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

// UPDATE campground
router.put("/:id", middleware.checkCampgroundOwner, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
      } else {
        req.flash("success", "Campground updated!");
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

// DESTROY campground
router.delete("/:id", middleware.checkCampgroundOwner, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground deleted!");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
