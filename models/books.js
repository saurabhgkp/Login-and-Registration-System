const mongoose = require("mongoose");

const books = mongoose.Schema({
    name: String,
    price: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

var Book = mongoose.model("Book", books);

module.exports = Book;
