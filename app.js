var express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  seedDB = require("./seed"),
  app = express();

mongoose.connect("mongodb://localhost/campcamp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// temp destroy db
seedDB();

//  Landing page
app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX -Display CGs
app.get("/campgrounds", (req, res) => {
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
app.post("/campgrounds", (req, res) => {
  // get data from form & add to campgrounds array
  // redirect back to campgrounds page
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: image, description: desc };

  // creat new CG and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW - show form to create new CGs
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// SHOW - shows more info about a CG
app.get("/campgrounds/:id", (req, res) => {
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

// =================================
// Comments route
// =================================

app.get("/campgrounds/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

app.post("/campgounds/:id/comments", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment._id);
          campground.save();
          res.redirect("/campgrounds/"+ campground._id);
        }
      });
    }
  });
});

// HTTP routes
app.listen(3000, process.env.IP, () => {
  console.log("CampCamp is listening!");
});
