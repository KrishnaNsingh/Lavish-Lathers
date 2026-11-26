const { sheets } = require("./googleSheetService");

function orderValues(order) {
  const { street, city, state, postalCode, instructions } = order.shippingAddress;
  return [
    String(order._id), order.customer.name, order.customer.email, String(order.customer.phone ?? ""),
    [street, city, state, postalCode].filter(Boolean).join(", "),
    order.items.map(item => `${item.name} (x${item.quantity})`).join(", "),
    order.items.reduce((sum, item) => sum + item.quantity, 0),
    order.pricing.subtotal, order.pricing.shipping, instructions || "", order.pricing.total,
    order.payment.paymentStatus, order.orderStatus,
    new Date(order.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  ];
}

async function syncOrderToSheet(order) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const ledger = await sheets.spreadsheets.values.get({ spreadsheetId, range: "Sheet1!A2:A" });
  const index = (ledger.data.values || []).findIndex(([id]) => id === String(order._id));
  if (index !== -1) {
    await sheets.spreadsheets.values.update({
      spreadsheetId, range: `Sheet1!M${index + 2}`, valueInputOption: "RAW",
      requestBody: { values: [[order.orderStatus]] },
    });
    return;
  }

  const metadata = await sheets.spreadsheets.get({
    spreadsheetId, ranges: ["Sheet1!A1:N1"],
    fields: "sheets(properties(title),tables(tableId,range,columnProperties(columnType)))",
  });
  const sheet = metadata.data.sheets.find(entry => entry.properties.title === "Sheet1");
  const table = sheet?.tables?.find(({ range }) => !range.startRowIndex && !range.startColumnIndex && range.endColumnIndex >= 14);
  const values = orderValues(order);
  if (table) {
    const cells = values.map((value, column) => {
      if (column === 13) {
        // Sheets stores dates as days since 1899-12-30, using the local wall time.
        const istSerial = new Date(order.createdAt).getTime() / 86400000 + 25569 + 330 / 1440;
        return {
          userEnteredValue: { numberValue: istSerial },
          userEnteredFormat: { numberFormat: { type: "DATE_TIME", pattern: "dd mmm yyyy, hh:mm:ss" } },
        };
      }
      if (column === 2 && table.columnProperties?.[column]?.columnType === "PEOPLE_CHIP" && value) {
        return { userEnteredValue: { stringValue: "@" }, chipRuns: [{ startIndex: 0, chip: { personProperties: { email: value } } }] };
      }
      return { userEnteredValue: typeof value === "number" ? { numberValue: value } : { stringValue: String(value ?? "") } };
    });
    await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{
      appendCells: { tableId: table.tableId, rows: [{ values: cells }], fields: "userEnteredValue,chipRuns,userEnteredFormat.numberFormat" },
    }] } });
  } else {
    // Preserve support for installations using an ordinary A:N range.
    await sheets.spreadsheets.values.append({ spreadsheetId, range: "Sheet1!A:N", valueInputOption: "RAW",
      requestBody: { values: [values] } });
  }
}

module.exports = { syncOrderToSheet };
