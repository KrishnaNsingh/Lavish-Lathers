const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
} = require("../controllers/productController");

// Public read-only endpoints
router.get("/", getProducts);
router.get("/:id", getProductById);

// NOTE: Product mutations (POST, PUT, DELETE) are handled exclusively
// under /api/admin/products (adminRoutes.js) where they are JWT-protected.

module.exports = router;