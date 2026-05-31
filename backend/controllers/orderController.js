const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const {
  sendCustomerOrderEmail,
  sendAdminOrderEmail,
} = require("../services/emailService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { total } = req.body;

    const options = {
      amount: total * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      customer,
      shippingAddress,
      items,
      pricing,
    } = req.body;

    // STEP 1
    // Generate expected signature

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // STEP 2
    // Verify payment

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // STEP 3
    // Save final order

    const order = await Order.create({
      customer,

      shippingAddress,

      items,

      pricing,

      payment: {
        razorpayOrderId: razorpay_order_id,

        razorpayPaymentId: razorpay_payment_id,

        razorpaySignature: razorpay_signature,

        paymentStatus: "paid",
      },
    });

    try {
      await sendCustomerOrderEmail(order);

      await sendAdminOrderEmail(order);

      console.log("Order emails sent successfully");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }
    // STEP 4
    // Return success

    res.status(201).json({
      success: true,
      message: "Payment verified & order created",

      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
};
