var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// INDEX -Display CGs
router.get("/", (req, res) => {
  //  get all CGs
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - Adding a new CG
router.post("/", isLoggedIn, (req, res) => {
  // get data from form & add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
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
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW - show form to create new CGs
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// SHOW - shows more info about a CG
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        // find the CG with provided ID
        // render SHOW with that ID
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// Check logged in middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
