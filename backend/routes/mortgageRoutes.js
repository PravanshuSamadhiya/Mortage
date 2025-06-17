const express = require("express");
const { createMortgage, getAllMortgages, getMortgageById,getMortgageSummary,getMortgagesByCustomerId } = require("../controllers/mortgageController");
const router = express.Router();

router.post("/create", createMortgage);
router.get("/get", getAllMortgages);
router.get('/customer/:customerId', getMortgagesByCustomerId);
router.get("/:id", getMortgageById);
router.get("/:id/summary", getMortgageSummary);


module.exports = router;