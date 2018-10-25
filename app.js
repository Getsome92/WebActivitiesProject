var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")
    Activity = require("./models/activity")
    seedDB   = require("./seeds")


mongoose.connect("mongodb://localhost:27017/activities", {useNewUrlParser: true});
seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("homepage");
});

app.get("/activities", function (req, res){
            //Get all the activities
            Activity.find({}, function(err, activities){
                if(err){
                    console.log(err);
                } else {
                    res.render("index", {activities: activities});
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
    res.render("new.ejs");
});
//app.listen(process.env.PORT, process.env.IP,  function(){
// console.log("connected")
// })

app.get("/activities/:id", function(req,res){

    Activity.findById(req.params.id).populate("comments").exec(function(err, foundActivity){
        if(err){
            console.log(err)
        } else {
            console.log(foundActivity);
            res.render("show", {activities: foundActivity});
        }
    });
});


var port = process.env.PORT || 3000;
var ip = process.env.IP || "localhost";
app.listen(port, ip, function () {
    console.log("Server has started successfully!");
});