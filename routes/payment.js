const express = require("express");
const PaymentController = require("../controllers/PaymentController.js");
const { validationRules } = require("../validators/index.js");
const router = express.Router();

router.get("/payment-details", PaymentController.getPaymentDetails);
router.get("/check-payment-status", PaymentController.checkPaymentStatus);
router.get("/processPayment", PaymentController.processPayment);
router.post("/delete-payment", PaymentController.deletePayment);
router.post("/cancel-payment", PaymentController.cancelPayment);

module.exports = router;
