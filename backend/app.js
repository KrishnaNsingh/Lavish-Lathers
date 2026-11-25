const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

const app = express();

app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://www.lavishlathers.in",
  "https://lavishlathers.in",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

app.use(apiLimiter);



// Webhooks before body parser
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());

app.post("/api/contact", require("./controllers/contactController").submitContact);
app.use("/api/products", productRoutes);
const customer = require("./controllers/customerAuth");
app.get("/api/auth/me", customer.me);
app.post("/api/auth/logout", customer.logout);
app.post("/api/auth/send-otp", authLimiter, customer.sendOtp);
app.post("/api/auth/verify-otp", authLimiter, customer.verifyOtp);
app.use("/api/auth", authLimiter, authRoutes);
app.post("/api/user/checkout-profile", customer.saveProfile);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminLimiter, adminRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;