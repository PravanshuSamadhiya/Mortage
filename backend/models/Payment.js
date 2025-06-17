const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  mortgageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mortgage' },
  amountPaid: Number,
  interestCleared: {
  type: Boolean,
  default: false
},
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
