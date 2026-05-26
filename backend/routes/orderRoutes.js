const express = require("express");

const {
  createRazorpayOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post(
  "/create-razorpay-order",
  createRazorpayOrder
);

module.exports = router;