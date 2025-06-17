const Payment = require("../models/Payment");

exports.addPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPaymentsByMortgage = async (req, res) => {
  const payments = await Payment.find({ mortgageId: req.params.id });
  res.json(payments);
};