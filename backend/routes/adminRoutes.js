const express = require("express");

const router = express.Router();

const { getAllOrders, 
    getDashboardStats, } = require("../controllers/adminController");

const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/orders", protectAdmin, getAllOrders);
router.get(
  "/stats",
  protectAdmin,
  getDashboardStats
);

module.exports = router;
