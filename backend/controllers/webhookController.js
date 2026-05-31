const crypto = require("crypto");

const Order = require("../models/Order");

const Product = require("../models/Product");

const razorpayWebhook = async (
  req,
  res
) => {
  try {

    const signature =
      req.headers["x-razorpay-signature"];

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_WEBHOOK_SECRET
        )
        .update(req.body)
        .digest("hex");

    if (
      generatedSignature !== signature
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid webhook signature",
        });
    }

    const payload =
      JSON.parse(req.body.toString());

    console.log(
      payload.event
    );

    res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
    razorpayWebhook,
};