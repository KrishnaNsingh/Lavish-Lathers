const express = require("express");

const router = express.Router();

const { getAllOrders, 
    getDashboardStats, 
    createProduct,
    updateProduct,
    deleteProduct,
  } = require("../controllers/adminController");

const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/orders", protectAdmin, getAllOrders);
router.get(
  "/stats",
  protectAdmin,
  getDashboardStats
);

router.post(
  "/products",
  protectAdmin,
  createProduct
);

router.put(
  "/products/:id",
  protectAdmin,
  updateProduct
);

router.delete(
  "/products/:id",
  protectAdmin,
  deleteProduct
);

module.exports = router;
