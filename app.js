var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/activities", {
    useNewUrlParser: true
});

// Instead of making the hard coded array, use MongoDB to store data
// var activities = [{
//         name: "Laser Tag",
//         image: "https://cdn.pixabay.com/photo/2016/03/25/14/19/paintball-1278895__340.jpg"
//     },
//     {
//         name: "Gokarts",
//         image: "https://cdn.pixabay.com/photo/2016/10/20/03/00/kart-1754533__340.jpg"
//     },
//     {
//         name: "Vodka",
//         image: "https://cdn.pixabay.com/photo/2017/08/03/21/48/drinks-2578446__340.jpg"
//     }
// ]

// Schema setup

var activitiesSchema = new mongoose.Schema({
    name: String,
    image: String,
    describtion: String
});

var Activity = mongoose.model("Activity", activitiesSchema);
// Activity.create({
//     name: "Gokarts",
//     image: "https://cdn.pixabay.com/photo/2016/10/20/03/00/kart-1754533__340.jpg",
//     describtion: "Twoja matka chcialaby to robic"
// }, function (err, activity) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("New Activity Added!");
//         console.log(activity);
//     }
// });

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

    Activity.findById(req.params.id, function(err, foundActivity){
        if(err){
            console.log(err)
        } else {
            res.render("show", {activities: foundActivity});
        }
    });
});


var port = process.env.PORT || 3000;
var ip = process.env.IP || "localhost";
app.listen(port, ip, function () {
    console.log("Server has started successfully!");
});