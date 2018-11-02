// all the middleware goes here
var Activity = require("../models/activity");
var Comment = require("../models/comment");
var middlewareObj ={};

middlewareObj.checkOwner = function(req,res,next){
    if (req.isAuthenticated()) {
        Activity.findById(req.params.id, function (err, foundActivity) {
            if (err) {
                res.redirect("back");
            } else {
                if(foundActivity.author.id.equals(req.user.id)){
                    next();
                    // res.render("activities/edit", { activities: foundActivity });
                } else {
                    res.redirect("back");
                } 
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwner = function(req,res,next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                   
                } else {
                    res.redirect("back");
                } 
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareObj;