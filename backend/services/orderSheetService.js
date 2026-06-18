// backend/services/orderSheetService.js
const { sheets } = require("./googleSheetService");

/**
 * Automatically parses a luxury order document and appends it 
 * as a clean layout row inside your Google Sheets ledger tracking.
 * @param {Object} order - The Mongoose Order document instance
 */
const appendOrderToSheet = async (order) => {
  try {
    if (!order) return;

    // 1. Map item list into a unified string line block
    const products = order.items
      .map((item) => `${item.name} (x${item.quantity})`)
      .join(", ");

    // 2. Format localized logistics shipping string block 
    const address = `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state || ""}, ${order.shippingAddress.postalCode}`.trim();

    // 3. Assemble structural row dimensions matching Sheet columns A to M
    const values = [[
      order._id.toString(),
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      address,
      products,
      order.items.reduce((sum, item) => sum + item.quantity, 0),
      order.pricing.subtotal,
      order.pricing.shipping,
      order.shippingAddress.instructions || "",
      order.pricing.total,
      order.payment?.paymentStatus || "paid",
      order.orderStatus || "pending",
      new Date(order.createdAt || Date.now()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    ]];

    // 4. Fire append request using spreadsheet environment parameters
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:N",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    console.log("📊 Order successfully synced to Google Sheets row:", response.data.updates?.updatedRange);
  } catch (error) {
    console.error("❌ Google Sheets append process failure:", error.message);
    // Kept non-blocking so an API failure here won't crash checkout operations
  }
};

module.exports = {
  appendOrderToSheet,
};