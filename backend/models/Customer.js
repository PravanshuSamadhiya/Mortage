const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  aadhaarNumber: String,
  photoUrl: String
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
