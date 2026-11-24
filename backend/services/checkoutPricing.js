const mongoose = require("mongoose");
const Product = require("../models/Product");

function reject(message) {
  throw Object.assign(new Error(message), { status: 400 });
}

async function priceCart(items, couponCode) {
  if (!Array.isArray(items) || !items.length) reject("Your cart is empty.");
  const quantities = new Map();
  for (const item of items) {
    if (!item || !mongoose.isObjectIdOrHexString(item.productId) || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
      reject("Invalid product or quantity.");
    }
    const id = String(item.productId).toLowerCase();
    quantities.set(id, (quantities.get(id) || 0) + item.quantity);
  }
  const products = await Product.find({ _id: { $in: [...quantities.keys()] } }).lean();
  const catalog = new Map(products.map(product => [String(product._id), product]));
  let subtotalPaise = 0;
  const lines = items.map(({ productId, quantity, isGift, giftNote, giftRecipient, customMessage }) => {
    const id = String(productId).toLowerCase();
    const product = catalog.get(id);
    if (!product || product.stock < quantities.get(id)) reject("An item is no longer available in the requested quantity.");
    subtotalPaise += Math.round(product.price * 100) * quantity;
    return { productId: product._id, registryId: product.registryId, name: product.name,
      price: product.price, images: product.images, quantity, isGift, giftNote, giftRecipient, customMessage };
  });
  if (couponCode && couponCode !== "LAVISH20") reject("Invalid coupon.");
  const shipping = subtotalPaise >= 200000 ? 0 : 299;
  const discount = couponCode ? Math.round(subtotalPaise * 0.2) : 0;
  const amount = subtotalPaise - discount + shipping * 100;
  if (!Number.isSafeInteger(amount) || amount <= 0) reject("Invalid order amount.");
  return { items: lines, amount, pricing: { subtotal: subtotalPaise / 100, shipping, discount: discount / 100, total: amount / 100 } };
}

module.exports = { priceCart };
