const express = require("express");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;