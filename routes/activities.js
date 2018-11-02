var express = require("express");
var router = express.Router();
var Activity = require("../models/activity");
var middleware = require("../middleware");


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

router.post("/", middleware.isLoggedin, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.describtion;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newActivity = {
        name: name,
        image: image,
        describtion: desc,
        author: author
    };
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

router.get("/new", middleware.isLoggedin, function (req, res) {
    res.render("activities/new");
});


router.get("/:id", function (req, res) {

    Activity.findById(req.params.id).populate("comments").exec(function (err, foundActivity) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundActivity);
            res.render("activities/show", {
                activities: foundActivity
            });
        }
    });
});

router.get("/:id/edit",middleware.checkOwner, function (req, res) {
    Activity.findById(req.params.id, function (err, foundActivity) {
        res.render("activities/edit", {activities: foundActivity});
    });
});

router.put("/:id",middleware.checkOwner, function (req, res) {
    Activity.findByIdAndUpdate(req.params.id, req.body.activity, function (err, updated) {
        if (err) {
            res.redirect("/activities");
        } else {
            res.redirect("/activities/" + req.params.id);
        }
    });
});

router.delete("/:id",middleware.checkOwner, function (req, res) {
    Activity.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/activities");
        } else {
            res.redirect("/activities");
        }
    });
});

module.exports = router;