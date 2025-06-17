const express = require("express");
const { createCustomer, getAllCustomers,getCustomerById,deleteCustomer } = require("../controllers/customerController");
const router = express.Router();

router.post("/create", createCustomer);
router.get("/get", getAllCustomers);
router.get('/get/:id', getCustomerById);
router.delete("/delete/:id", deleteCustomer);
module.exports = router;