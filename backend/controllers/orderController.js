const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret:
    process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (
  req,
  res
) => {
  try {
    const { total } = req.body;

    const options = {
      amount: total * 100,
      currency: "INR",
      receipt:
        "receipt_" + Date.now(),
    };

    const order =
      await razorpay.orders.create(
        options
      );

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
};