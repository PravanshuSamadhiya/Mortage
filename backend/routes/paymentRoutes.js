const express = require("express");
const { addPayment, getPaymentsByMortgage } = require("../controllers/paymentController");
const router = express.Router();

router.post("/add", addPayment);
router.get("/:id", getPaymentsByMortgage);

module.exports = router;