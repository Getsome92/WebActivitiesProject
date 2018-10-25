var express = require("express");
var router  = express.Router({mergeParams: true});
var Activity = require("../models/activity");
var Comment = require("../models/comment");

router.get("/new", isLoggedin, function (req, res) {
    Activity.findById(req.params.id, function (err, activity) {
        if (err) {
            console.log(err);

        } else {
            res.render("comments/new", {
                activities: activity
            });
        }
    });
});

router.post("/", isLoggedin, function (req, res) {
    Activity.findById(req.params.id, function (err, activity) {
        if (err) {
            console.log(err);
            redirect("/activities");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    activity.comments.push(comment);
                    activity.save();
                    res.redirect("/activities/" + activity._id);
                }
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
