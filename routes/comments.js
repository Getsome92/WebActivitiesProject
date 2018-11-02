var express = require("express");
var router  = express.Router({mergeParams: true});
var Activity = require("../models/activity");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedin, function (req, res) {
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

router.post("/", middleware.isLoggedin, function (req, res) {
    Activity.findById(req.params.id, function (err, activity) {
        if (err) {
            console.log(err);
            redirect("/activities");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    activity.comments.push(comment);
                    activity.save();
                    console.log(comment);
                    res.redirect("/activities/" + activity._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit",middleware.checkCommentOwner, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {activities_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id",middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/activities/"+ req.params.id);
       }
    });
});

router.delete("/:comment_id",middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/activities/" + req.params.id);
        }
    })
});

function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};


module.exports = router;
