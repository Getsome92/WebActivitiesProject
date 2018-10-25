var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Activity = require("./models/activity"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")


mongoose.connect("mongodb://localhost:27017/activities", {
    useNewUrlParser: true
});
seedDB();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT

app.use(require("express-session")({
    secret: "This is the hashing",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function (req, res) {
    res.render("homepage");
});

app.get("/activities", function (req, res) {
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

app.post("/activities", function (req, res) {
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

app.get("/activities/new", function (req, res) {
    res.render("activities/new");
});
//app.listen(process.env.PORT, process.env.IP,  function(){
// console.log("connected")
// })

app.get("/activities/:id", function (req, res) {

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

//========================
// COMMENT SECTION
//========================

app.get("/activities/:id/comments/new",isLoggedin, function (req, res) {
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

app.post("/activities/:id/comments", isLoggedin, function (req, res) {
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

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/activities");
        });
    });
});

app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/login", passport.authenticate("local", {
        successRedirect: "/activities",
        failureRedirect: "/login"
    }),
    function (req, res) {

    });
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/activities");
});

function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

var port = process.env.PORT || 3000;
var ip = process.env.IP || "localhost";
app.listen(port, ip, function () {
    console.log("Server has started successfully!");
});