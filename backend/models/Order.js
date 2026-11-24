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

        // imageUrl: String,
        images: [String],

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

    fulfillment: {
      pending: Boolean,
      retryAt: Date,
      lease: String,
      inventory: Boolean,
      sheet: Boolean,
      customerEmail: Boolean,
      adminEmail: Boolean,
    },

    pricing: {
      discount: Number,
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

orderSchema.index({ "payment.razorpayOrderId": 1 });
orderSchema.index({ "fulfillment.pending": 1, "fulfillment.retryAt": 1 }, { partialFilterExpression: { "fulfillment.pending": true } });

// Add index on paymentStatus for dashboard sales aggregates
orderSchema.index({ "payment.paymentStatus": 1 });
// Add index on createdAt for sorting logs
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
