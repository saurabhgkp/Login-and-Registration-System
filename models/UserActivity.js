const mongoose = require("mongoose");

const UserActivities = mongoose.Schema({
    userId: String,
    action: String,
    timestamp: { type: Date, default: Date.now },
});

var UserActivity = mongoose.model("UserActivity", UserActivities);

module.exports = UserActivity;