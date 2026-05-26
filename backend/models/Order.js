const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      email: String,
      phone: String,
    },

    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      instructions: String,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,

        quantity: Number,

        price: Number,

        imageUrl: String,

        customMessage: String,
      },
    ],

    payment: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,

      paymentStatus: {
        type: String,
        enum: [
          "pending",
          "paid",
          "failed",
        ],
        default: "pending",
      },
    },

    pricing: {
      subtotal: Number,
      shipping: Number,
      total: Number,
    },

    orderStatus: {
      type: String,
      enum: [
        "processing",
        "shipped",
        "delivered",
      ],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);