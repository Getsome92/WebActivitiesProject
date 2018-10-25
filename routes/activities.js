var express = require("express");
var router  = express.Router();
var Activity = require("../models/activity");

router.get("/", function (req, res) {
    //Get all the activities
    Activity.find({}, function (err, activities) {
        if (err) {
            console.log(err);
        } else {
            res.render("activities/index", {
                activities: activities
            });
        }
    });

});

router.post("/", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.describtion;
    var newActivity = {
        name: name,
        image: image,
        describtion: desc
    }
    // Create activity and push it into DB
    // Instead of pushing to array as previosuly
    // activities.push(newActivity);
    Activity.create(newActivity, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/activities");
        }
    });
});

router.get("/new", function (req, res) {
    res.render("activities/new");
});
//app.listen(process.env.PORT, process.env.IP,  function(){
// console.log("connected")
// })

router.get("/:id", function (req, res) {

    Activity.findById(req.params.id).populate("comments").exec(function (err, foundActivity) {
        if (err) {
            console.log(err)
        } else {
            console.log(foundActivity);
            res.render("activities/show", {
                activities: foundActivity
            });
        }
    });
});

function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};
module.exports = router;