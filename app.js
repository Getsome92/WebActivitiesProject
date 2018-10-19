var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var activities =[
    {name: "Laser Tag", image: "https://cdn.pixabay.com/photo/2016/03/25/14/19/paintball-1278895__340.jpg"},
    {name: "Gokarts", image: "https://cdn.pixabay.com/photo/2016/10/20/03/00/kart-1754533__340.jpg"},
    {name: "Vodka", image: "https://cdn.pixabay.com/photo/2017/08/03/21/48/drinks-2578446__340.jpg"}
    ]

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("homepage");
});

app.get("/activities", function(req, res) {
    
    res.render("activities", {activities:activities});
});

app.post("/activities", function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var newActivity = {name: name, image: image}
    activities.push(newActivity);
    res.redirect("/activities");
});   

app.get("/activities/new",function(req,res){
    res.render("new.ejs");
});
//app.listen(process.env.PORT, process.env.IP,  function(){
    // console.log("connected")
// })
var port = process.env.PORT || 3000;
var ip = process.env.IP || "localhost";
app.listen(port, ip, function () {
    console.log("Server has started successfully!");
});