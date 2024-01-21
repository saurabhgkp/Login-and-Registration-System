const mongoose = require("mongoose");

const PurchaseRequests = mongoose.Schema({
    userId: String,
    bookId: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

});

var PurchaseRequest = mongoose.model("PurchaseRequest", PurchaseRequests);

module.exports = PurchaseRequest;