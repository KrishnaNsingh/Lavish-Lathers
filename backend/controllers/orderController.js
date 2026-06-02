const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { appendOrderToSheet } = require("../services/orderSheetService");
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
    const { total, customer, shippingAddress, items, pricing } = req.body;

    const options = {
      amount: total * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save pending order details in database prior to payment popup opening
    await Order.create({
      customer,
      shippingAddress,
      items,
      pricing,
      payment: {
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: "pending",
      },
    });

    res.json(razorpayOrder);
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
    // Find and update the existing order
    let order = await Order.findOne({
      "payment.razorpayOrderId": razorpay_order_id,
    });

    if (order) {
      order.payment.razorpayPaymentId = razorpay_payment_id;
      order.payment.razorpaySignature = razorpay_signature;
      order.payment.paymentStatus = "paid";
      await order.save();
    } else {
      // Fallback if order wasn't saved beforehand
      order = await Order.create({
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
    }

    console.log("Before Google Sheet");
    await appendOrderToSheet(order);
    console.log("After Google Sheet");

    try {
      await sendCustomerOrderEmail(order);

      await sendAdminOrderEmail(order);

      console.log("Order emails sent successfully");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

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
