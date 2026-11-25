const User = require("../models/User");
const { sessionId } = require("./customerAuth");
const { deliveryProfile } = require("../services/checkoutProfile");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { priceCart } = require("../services/checkoutPricing");
const { recordPayment } = require("../services/fulfillment");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createRazorpayOrder(req, res) {
  try {
    const { customer, shippingAddress, items, couponCode } = req.body;
    const saveCheckoutFor = req.body.saveCheckout === true ? sessionId(req) : null;
    if (req.body.saveCheckout === true && !saveCheckoutFor) return res.status(401).json({ message: "Please sign in again or turn off saving details." });
    if (saveCheckoutFor) {
      const user = await User.findOne({ _id: saveCheckoutFor, isVerified: true });
      if (!user) return res.status(401).json({ message: "Please sign in again to save your details." });
      user.savedCheckout = deliveryProfile(customer, shippingAddress);
      if (user.validateSync()) return res.status(400).json({ message: "Check your delivery details before saving." });
    }
    const quote = await priceCart(items, couponCode);
    const paymentOrder = await razorpay.orders.create({
      amount: quote.amount, currency: "INR", receipt: "receipt_" + Date.now(),
    });
    await Order.create({ saveCheckoutFor, customer, shippingAddress, items: quote.items, pricing: quote.pricing,
      payment: { razorpayOrderId: paymentOrder.id, paymentStatus: "pending" } });
    res.json(paymentOrder);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.status ? error.message : "Unable to create your order." });
  }
}

async function verifyPaymentAndCreateOrder(req, res) {
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(orderId + "|" + paymentId).digest("hex");
  if (expected !== signature) return res.status(400).json({ message: "Payment signature verification failed." });
  const payment = await razorpay.payments.fetch(paymentId);
  if (payment.order_id !== orderId || payment.status !== "captured") {
    return res.status(202).json({ success: false, message: "Payment confirmation is pending. Please check your email before paying again." });
  }
  const order = await recordPayment(payment, signature);
  res.json({ success: true, order });
}

module.exports = { createRazorpayOrder, verifyPaymentAndCreateOrder };
