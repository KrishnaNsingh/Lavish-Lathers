const express = require("express");

const {
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post(
  "/create-razorpay-order",
  createRazorpayOrder
);

router.post(
  "/verify-payment",
  verifyPaymentAndCreateOrder
);

module.exports = router;