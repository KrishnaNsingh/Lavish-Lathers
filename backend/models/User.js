const mongoose = require("mongoose");

const savedCheckout = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 160 },
  phone: { type: String, required: true, trim: true, maxlength: 24 },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  city: { type: String, required: true, trim: true, maxlength: 120 },
  state: { type: String, required: true, trim: true, maxlength: 120 },
  pincode: { type: String, required: true, match: /^[1-9]\d{5}$/ },
}, { _id: false });

module.exports = mongoose.model("User", new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  isVerified: { type: Boolean, default: false },
  savedCheckout: { type: savedCheckout, default: null },
  checkoutSavedAt: Date,
}, { timestamps: true }));
