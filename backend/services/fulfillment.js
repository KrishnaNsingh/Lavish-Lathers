const { randomUUID } = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { appendOrderToSheet } = require("./orderSheetService");
const { sendCustomerOrderEmail, sendAdminOrderEmail } = require("./emailService");

async function recordPayment(payment, signature) {
  const match = { "payment.razorpayOrderId": payment.order_id };
  const existing = await Order.findOne(match);
  if (!existing || payment.currency !== "INR" || Number(payment.amount) !== Math.round(existing.pricing.total * 100)) {
    throw new Error("Captured payment does not match the stored order.");
  }
  const fields = {
    "payment.paymentStatus": "paid",
    "payment.razorpayPaymentId": payment.id,
    "fulfillment.pending": true,
    "fulfillment.retryAt": new Date(),
  };
  if (signature) fields["payment.razorpaySignature"] = signature;
  // The transition and the durable job are committed in the same document write.
  const updated = await Order.findOneAndUpdate(
    { ...match, "payment.paymentStatus": { $ne: "paid" } },
    { $set: fields }, { new: true },
  );
  return updated || await Order.findOne(match);
}

async function updateInventory(order) {
  const quantities = new Map();
  for (const item of order.items) {
    const id = String(item.productId);
    quantities.set(id, (quantities.get(id) || 0) + item.quantity);
  }
  for (const [id, quantity] of quantities) {
    // Keep the receipt with the decrement so a restart between products is safe.
    const result = await Product.updateOne({ _id: id, fulfilledOrders: { $ne: order._id } }, {
      $inc: { stock: -quantity }, $addToSet: { fulfilledOrders: order._id },
    });
    if (!result.matchedCount && !await Product.exists({ _id: id })) {
      throw new Error("A purchased product is missing from inventory.");
    }
  }
}

const steps = { inventory: updateInventory, sheet: appendOrderToSheet,
  customerEmail: sendCustomerOrderEmail, adminEmail: sendAdminOrderEmail };

async function processNextOrder() {
  const lease = randomUUID();
  const order = await Order.findOneAndUpdate(
    { "fulfillment.pending": true, "fulfillment.retryAt": { $lte: new Date() } },
    { $set: { "fulfillment.lease": lease, "fulfillment.retryAt": new Date(Date.now() + 300000) } },
    { sort: { "fulfillment.retryAt": 1 }, new: true },
  );
  if (!order) return false;

  const owner = { _id: order._id, "fulfillment.lease": lease };
  let pending = false;
  for (const [name, run] of Object.entries(steps)) {
    if (order.fulfillment[name]) continue;
    try {
      const renewed = await Order.updateOne(owner, { $set: { "fulfillment.retryAt": new Date(Date.now() + 300000) } });
      if (!renewed.matchedCount) return true;
      await run(order);
      await Order.updateOne(owner, { $set: { [`fulfillment.${name}`]: true } });
    } catch (error) {
      pending = true;
      console.error("Fulfillment step failed", order.id, name, error.message);
    }
  }
  await Order.updateOne(owner, { $set: { "fulfillment.pending": pending,
    "fulfillment.retryAt": new Date(Date.now() + 60000) }, $unset: { "fulfillment.lease": 1 } });
  return true;
}

function startFulfillmentWorker() {
  async function tick() {
    let processed = false;
    try {
      processed = await processNextOrder();
    } catch (error) {
      console.error("Fulfillment worker:", error.message);
    }
    setTimeout(tick, processed ? 0 : 5000).unref();
  }
  void tick();
}

module.exports = { recordPayment, startFulfillmentWorker, processNextOrder };
