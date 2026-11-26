const { google } = require("googleapis");

const path = require("node:path");
const { existsSync } = require("node:fs");
const localKey = path.join(__dirname, "../config/google-service-account.json");
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || (existsSync(localKey) ? localKey : undefined);
const credentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
  ? { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n") }
  : undefined;

const auth = new google.auth.GoogleAuth({
  ...(credentials ? { credentials } : { keyFile }),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

module.exports = {
  sheets,
};
