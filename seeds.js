var mongoose = require("mongoose");
var Activity = require("./models/activity");
var Comment = require("./models/comment");

var data = [{
    name: "Gokarts",
    image: "https://cdn.pixabay.com/photo/2016/10/20/03/00/kart-1754533__340.jpg",
    describtion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
}, {
    name: "Samochodziki",
    image: "https://cdn.pixabay.com/photo/2016/10/20/03/00/kart-1754533__340.jpg",
    describtion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
}, {
    name: "Pojazdy",
    image: "https://cdn.pixabay.com/photo/2016/10/20/03/00/kart-1754533__340.jpg",
    describtion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
}]

function seedDB() {
    Activity.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("All activities are removed")
            data.forEach(function (seed) {
                Activity.create(seed, function (err, activity) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Activity added");
                        Comment.create({
                            text: "This is a comment",
                            author: "Mother"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                activity.comments.push(comment);
                                activity.save();
                                console.log("created new comment");
                            }
                        });
                    }
                });

            });
        }
    });
}
module.exports = seedDB;