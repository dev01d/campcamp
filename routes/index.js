var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//  Root route
router.get("/", (req, res) => {
  res.render("landing");
});

// Show registration form
router.get("/register", (req, res) => {
  res.render("register");
});

// handle sign up logic
router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome to CampCamp" + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// Show login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle auth logic and redirect
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: true,
    failureFlash: true
  }),
  (req, res) => {}
);

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have been logged out");
  res.redirect("/campgrounds");
});

module.exports = router;
