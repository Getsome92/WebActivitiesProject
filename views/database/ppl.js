var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ppl_app", { useNewUrlParser: true });

var pplSchema = mongoose.Schema({
    name: String,
    age: Number,
    activity: String    
})

var Ppl = mongoose.model("Ppl", pplSchema);

// var michal = new Ppl({
//     name: "Michal",
//     age: 21,
//     activity: "MotoGP"
// });

// michal.save(function(err, ppl){
//     if(err){
//         console.log("Something went wrong");
//     }else {
//         console.log("Saved into DB!")
//         console.log(ppl)
//     }
// });

Ppl.find({}, function(err, ppls){
    if(err){
        console.log("Something went wrong");
        console.log(err)
    }else {
        console.log("And the attendies are :")
        console.log(ppls);
    }
});