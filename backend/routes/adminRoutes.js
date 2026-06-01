const express = require("express");

const router = express.Router();

const {
  getAllOrders,
  getDashboardStats,
  updateOrderStatus,
} = require("../controllers/adminController");

const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { sendAdminOrderEmail } = require("../services/emailService");

const { protectAdmin } = require("../middleware/authMiddleware");

const { exportOrdersExcel } = require("../controllers/adminController");

router.get("/orders", protectAdmin, getAllOrders);
router.get("/stats", protectAdmin, getDashboardStats);

router.post("/products", protectAdmin, createProduct);

router.put("/products/:id", protectAdmin, updateProduct);

router.delete("/products/:id", protectAdmin, deleteProduct);

router.put("/orders/:id/status", protectAdmin, updateOrderStatus);

router.get("/orders/export", exportOrdersExcel);

// router.get("/test-email", protectAdmin, async (req, res) => {
//   try {
//     await sendAdminOrderEmail({
//       customer: {
//         name: "Krishna",
//         email: "test@gmail.com",
//         phone: "9999999999",
//       },

//       pricing: {
//         total: 598,
//       },

//       orderStatus: "pending",

//       createdAt: new Date(),
//     });

//     res.send("Email sent");
//   } catch (error) {
//     console.error(error);

//     res.status(500).send(error.message);
//   }
// });

module.exports = router;
