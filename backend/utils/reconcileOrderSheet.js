require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const Order = require("../models/Order");
const { sheets } = require("../services/googleSheetService");

async function reconcile() {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 1 || args[0] !== "--queue-missing")) {
    throw new Error("Run with no arguments to audit, or --queue-missing to queue repairs.");
  }
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID, range: "Sheet1!A:A",
  });
  if (data.values?.[0]?.[0] !== "Order ID") throw new Error("Expected the Order ID header in Sheet1!A1.");
  const existing = new Set(data.values.slice(1).map(([id]) => id));
  await mongoose.connect(process.env.MONGO_URI, { autoIndex: false, autoCreate: false });
  const paid = await Order.find({ "payment.paymentStatus": "paid" }).select("_id").lean();
  const missing = paid.filter(order => !existing.has(String(order._id))).map(order => order._id);
  console.log(`Paid orders: ${paid.length}. Missing from Sheet1: ${missing.length}.`);
  if (args.includes("--queue-missing") && missing.length) {
    const result = await Order.updateMany({
      _id: { $in: missing }, "payment.paymentStatus": "paid", "sheetSync.pending": { $ne: true },
    }, { $set: { "sheetSync.pending": true }, $inc: { "sheetSync.revision": 1 } });
    console.log(`Queued ${result.modifiedCount} orders for the sheet worker.`);
  }
}

reconcile().catch(error => {
  console.error("Ledger reconciliation failed:", error.message);
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
