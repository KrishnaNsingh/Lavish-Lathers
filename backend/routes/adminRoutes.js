const express = require("express");

const router = express.Router();

const {
  getAllOrders,
  getDashboardStats,
  updateOrderStatus,
  exportOrdersExcel,
} = require("../controllers/adminController");

const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/stats", protectAdmin, getDashboardStats);
router.get("/orders", protectAdmin, getAllOrders);
router.get("/orders/export", protectAdmin, exportOrdersExcel);

router.post("/products", protectAdmin, createProduct);
router.put("/products/:id", protectAdmin, updateProduct);
router.delete("/products/:id", protectAdmin, deleteProduct);

router.put("/orders/:id/status", protectAdmin, updateOrderStatus);

module.exports = router;
