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

        registryId: String,

        name: String,

        quantity: Number,

        price: Number,

        imageUrl: String,

        isGift: {
          type: Boolean,
          default: false,
        },

        giftNote: String,

        giftRecipient: String,

        customMessage: String,
      },
    ],

    payment: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,

      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
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
      enum: ["pending", "packaging", "shipped", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Add index on paymentStatus for dashboard sales aggregates
orderSchema.index({ "payment.paymentStatus": 1 });
// Add index on createdAt for sorting logs
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
