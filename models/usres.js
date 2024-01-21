const { Number } = require("mongoose");
const mongoose = require("mongoose");

const users = mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  password: String,
  resetToken: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  uniqueString: String,
  isActive: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

var User = mongoose.model("User", users);

module.exports = User;
