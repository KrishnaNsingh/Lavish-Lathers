const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const {
  sendCustomerOrderEmail,
  sendAdminOrderEmail,
} = require("../services/emailService");

const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({
        message: "Invalid webhook signature",
      });
    }

    const payload = JSON.parse(req.body.toString());
    console.log("Razorpay Webhook Event Received:", payload.event);

    // Resolve order status on successful webhook callback
    if (payload.event === "order.paid" || payload.event === "payment.captured") {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      const order = await Order.findOne({ "payment.razorpayOrderId": razorpayOrderId });
      if (order && order.payment.paymentStatus !== "paid") {
        order.payment.paymentStatus = "paid";
        order.payment.razorpayPaymentId = razorpayPaymentId;
        await order.save();

        try {
          await sendCustomerOrderEmail(order);
          await sendAdminOrderEmail(order);
          console.log("Webhook email notifications dispatched successfully");
        } catch (emailError) {
          console.error("Webhook email notification failure:", emailError);
        }
      }
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Webhook processing failure:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  razorpayWebhook,
};