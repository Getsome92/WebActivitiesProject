var mongoose = require("mongoose");

var activitiesSchema = new mongoose.Schema({
    name: String,
    image: String,
    describtion: String,
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Activity", activitiesSchema);