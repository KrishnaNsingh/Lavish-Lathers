const User = require("../models/User");

function deliveryProfile(customer, shippingAddress) {
  return {
    fullName: customer?.name, phone: customer?.phone, address: shippingAddress?.street,
    city: shippingAddress?.city, state: shippingAddress?.state, pincode: shippingAddress?.postalCode,
  };
}

async function saveOrderProfile(order) {
  if (!order.saveCheckoutFor) return;
  await User.updateOne({
    _id: order.saveCheckoutFor,
    $or: [{ checkoutSavedAt: { $exists: false } }, { checkoutSavedAt: { $lte: order.createdAt } }],
  }, { $set: { savedCheckout: deliveryProfile(order.customer, order.shippingAddress), checkoutSavedAt: order.createdAt } }, { runValidators: true });
}

module.exports = { deliveryProfile, saveOrderProfile };
