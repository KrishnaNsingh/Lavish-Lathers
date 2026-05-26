const express = require("express");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;