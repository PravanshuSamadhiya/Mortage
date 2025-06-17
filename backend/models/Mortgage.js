const mongoose = require("mongoose");

const mortgageSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  itemName: String,
  weight: Number,
  karat: String,
  pricePerGram: Number,
  totalValue: Number,
  advanceGiven: Number,
  interestRate: Number, // % per month
  startDate: Date,
  isClosed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Mortgage", mortgageSchema);
