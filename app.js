var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Activity = require("./models/activity"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    activitiesRoutes = require("./routes/activities"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/activities", {
    useNewUrlParser: true
});

seedDB();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
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

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


app.use(indexRoutes);
app.use("/activities/:id/comments", commentRoutes);
app.use("/activities", activitiesRoutes);

var port = process.env.PORT || 3000;
var ip = process.env.IP || "localhost";
app.listen(port, ip, function () {
    console.log("Server has started successfully!");
});