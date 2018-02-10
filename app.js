var express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seed"),
  app = express();

mongoose.connect("mongodb://localhost/campcamp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// temp destroy and populate db
seedDB();

app.use(
  require("express-session")({
    secret: "This is the best App.",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

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
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: image, description: desc };

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
//        Comment routes
// =================================

// Add new comment
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});
// Handle comment push to DB
app.post("/campgounds/:id/comments", isLoggedIn, (req, res) => {
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
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// =================================
//           Auth routes
// =================================

// Show registration form
app.get("/register", (req, res) => {
  res.render("register");
});
// handle sign up logic
app.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/campgrounds");
    });
  });
});

// Show login form
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle auth redirect
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

// Logout
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

// Check logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// HTTP routes
app.listen(3000, process.env.IP, () => {
  console.log("CampCamp is listening!");
});
