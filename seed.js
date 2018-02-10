var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
    name: "Cloud's Rest",
    image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
    description:
      "Lorem ipsum dolor amet freegan cray organic, green juice kinfolk semiotics godard hammock unicorn poutine gentrify. Art party freegan disrupt, cardigan sustainable chicharrones tote bag four dollar toast typewriter cray microdosing ugh. Gentrify bushwick direct trade yr pinterest lo-fi. Forage glossier wayfarers, post-ironic tumeric direct trade drinking vinegar put a bird on it poke kombucha YOLO. Sartorial selfies cardigan shoreditch, irony pinterest PBR&B heirloom"
  },
  {
    name: "Desert Mesa",
    image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
    description:
      "Lorem ipsum dolor amet freegan cray organic, green juice kinfolk semiotics godard hammock unicorn poutine gentrify. Art party freegan disrupt, cardigan sustainable chicharrones tote bag four dollar toast typewriter cray microdosing ugh. Gentrify bushwick direct trade yr pinterest lo-fi. Forage glossier wayfarers, post-ironic tumeric direct trade drinking vinegar put a bird on it poke kombucha YOLO. Sartorial selfies cardigan shoreditch, irony pinterest PBR&B heirloom"
  },
  {
    name: "Canyon Floor",
    image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
    description:
      "Lorem ipsum dolor amet freegan cray organic, green juice kinfolk semiotics godard hammock unicorn poutine gentrify. Art party freegan disrupt, cardigan sustainable chicharrones tote bag four dollar toast typewriter cray microdosing ugh. Gentrify bushwick direct trade yr pinterest lo-fi. Forage glossier wayfarers, post-ironic tumeric direct trade drinking vinegar put a bird on it poke kombucha YOLO. Sartorial selfies cardigan shoreditch, irony pinterest PBR&B heirloom"
  },
  {
    name: "Sierra View",
    image:
      "https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a2f853d71f43de92c4d568531aa5608f&auto=format&fit=crop&w=800&q=80",
    description:
      "Lorem ipsum dolor amet freegan cray organic, green juice kinfolk semiotics godard hammock unicorn poutine gentrify. Art party freegan disrupt, cardigan sustainable chicharrones tote bag four dollar toast typewriter cray microdosing ugh. Gentrify bushwick direct trade yr pinterest lo-fi. Forage glossier wayfarers, post-ironic tumeric direct trade drinking vinegar put a bird on it poke kombucha YOLO. Sartorial selfies cardigan shoreditch, irony pinterest PBR&B heirloom"
  }
];

function seedDB() {
  //Remove all campgrounds
  Campground.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("removed campgrounds!");
    Comment.remove({}, function (err) {
      if (err) {
        console.log(err);
      }
      console.log("removed comments!");
      //add a few campgrounds
      data.forEach(function (seed) {
        Campground.create(seed, function (err, campground) {
          if (err) {
            console.log(err);
          } else {
            console.log("added a campground");
            //create a comment
            Comment.create(
              {
                text:
                  "PBR&B slow-carb bicycle rights wolf coloring book sustainable farm whatever pour-over drinking vinegar. Fixie sartorial subway tile master cleanse poutine. Master cleanse crucifix VHS raw denim, bitters you probably haven't heard of them",
                author: "Windmill"
              },
              function(err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment._id);
                  campground.save();
                  console.log("Created new comment");
                }
              }
            );
          }
        });
      });
    });
  });
  //add a few comments
}

module.exports = seedDB;