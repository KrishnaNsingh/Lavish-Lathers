const { randomInt, createHmac } = require("node:crypto");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const { saveOrderProfile } = require("../services/checkoutProfile");
const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendOtpEmail } = require("../services/emailService");

const cookie = "lavish_customer";
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api" };
const audience = "lavish-storefront";
const fields = "email savedCheckout -_id";

function sessionId(req) {
  const token = (req.headers.cookie || "").split(/;\s*/).find(value => value.startsWith(cookie + "="));
  if (!token) return null;
  try {
    return jwt.verify(token.slice(cookie.length + 1), process.env.JWT_SECRET, { algorithms: ["HS256"], audience }).sub;
  } catch {
    return null;
  }
}

function normalizedEmail(body) {
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function hash(email, code) {
  return createHmac("sha256", process.env.JWT_SECRET).update(`customer-otp:${email}:${code}`).digest("hex");
}

async function sendOtp(req, res) {
  const email = normalizedEmail(req.body);
  if (!email) return res.status(400).json({ message: "Enter a valid email address." });
  await Otp.init();
  const now = Date.now();
  const code = String(randomInt(1000000)).padStart(6, "0");
  const otpHash = hash(email, code);
  try {
    await Otp.findOneAndUpdate({ email, sentAt: { $lte: new Date(now - 60000) } },
      { $set: { email, otpHash, sentAt: new Date(now), expiresAt: new Date(now + 600000), attempts: 0 } },
      { upsert: true });
  } catch (error) {
    if (error.code !== 11000) throw error;
    const current = await Otp.findOne({ email }).select("sentAt").lean();
    const retryAfter = Math.max(1, Math.ceil(((current?.sentAt?.getTime() || now) + 60000 - Date.now()) / 1000));
    return res.set("Retry-After", String(retryAfter)).status(429).json({ message: "A code was recently requested.", retryAfter });
  }
  try {
    await sendOtpEmail(email, code);
  } catch {
    // Keep the cooldown after an ambiguous provider failure.
    return res.status(503).json({ message: "Email delivery could not be confirmed. Please try again in a minute.", retryAfter: 60 });
  }
  res.json({ retryAfter: 60 });
}

async function verifyOtp(req, res) {
  const email = normalizedEmail(req.body);
  const code = req.body?.code;
  if (!email || typeof code !== "string" || !/^\d{6}$/.test(code)) return res.status(400).json({ message: "Enter your six-digit code." });
  const otpHash = hash(email, code);
  const valid = { email, expiresAt: { $gt: new Date() }, attempts: { $lt: 5 } };
  // Reserve one of the five attempts before checking the candidate.
  const challenge = await Otp.findOneAndUpdate(valid, { $inc: { attempts: 1 } }, { new: true });
  const consumed = challenge && challenge.otpHash === otpHash && await Otp.findOneAndDelete({
    _id: challenge._id, sentAt: challenge.sentAt, otpHash, expiresAt: { $gt: new Date() },
  });
  if (!consumed) return res.status(400).json({ message: "Code invalid or expired. Request a new code if needed." });
  const user = await User.findOneAndUpdate({ email }, { $set: { isVerified: true } }, { upsert: true, new: true });
  const token = jwt.sign({}, process.env.JWT_SECRET, { algorithm: "HS256", subject: user.id, audience, expiresIn: "30d" });
  res.cookie(cookie, token, { ...cookieOptions, maxAge: 30 * 86400000 }).json({ email: user.email, savedCheckout: user.savedCheckout });
}

async function me(req, res) {
  const id = sessionId(req);
  res.set("Cache-Control", "private, no-store").json(id ? await User.findOne({ _id: id, isVerified: true }).select(fields) : null);
}

function logout(req, res) {
  res.clearCookie(cookie, cookieOptions).status(204).end();
}

async function saveProfile(req, res) {
  const id = sessionId(req);
  if (!id) return res.status(401).json({ message: "Sign in to save your details." });
  res.set("Cache-Control", "private, no-store");
  if (req.body?.orderId !== undefined) {
    if (typeof req.body.orderId !== "string" || !/^[a-f0-9]{24}$/i.test(req.body.orderId)) {
      return res.status(400).json({ message: "Invalid order reference." });
    }
    const order = await Order.findOne({ _id: req.body.orderId, saveCheckoutFor: id, "payment.paymentStatus": "paid" });
    if (!order) return res.status(404).json({ message: "Order unavailable for this account." });
    await saveOrderProfile(order);
    return me(req, res);
  }
  const savedCheckout = {};
  for (const key of ["fullName", "phone", "address", "city", "state", "pincode"]) {
    if (typeof req.body?.[key] !== "string") return res.status(400).json({ message: "Complete your delivery details." });
    savedCheckout[key] = req.body[key].trim();
  }
  try {
    const user = await User.findOneAndUpdate({ _id: id, isVerified: true }, { $set: { savedCheckout, checkoutSavedAt: new Date() } },
      { new: true, runValidators: true }).select(fields);
    if (!user) return res.status(401).json({ message: "Please sign in again." });
    res.json(user);
  } catch (error) {
    if (error.name !== "ValidationError") throw error;
    res.status(400).json({ message: "Check your delivery details and PIN code." });
  }
}

module.exports = { sendOtp, verifyOtp, me, logout, saveProfile, sessionId };
