const crypto = require("crypto");
const Order = require("../models/Order");
const { recordPayment } = require("../services/fulfillment");
const { sendPaymentFailedEmail } = require("../services/emailService");

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
    if (
      payload.event === "order.paid" ||
      payload.event === "payment.captured"
    ) {
      await recordPayment(payload.payload.payment.entity);
    }

    if (payload.event === "payment.failed") {
      const order = await Order.findOneAndUpdate({
        "payment.razorpayOrderId": payload.payload.payment.entity.order_id,
        "payment.paymentStatus": "pending",
      }, { $set: { "payment.paymentStatus": "failed" } }, { new: true });
      if (order) await sendPaymentFailedEmail(order);
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
