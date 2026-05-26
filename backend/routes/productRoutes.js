const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");


const {
  protectAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/:id", getProductById);

router.get("/", getProducts);

router.put(
  "/:id",
  protectAdmin,
  updateProduct
);

router.post(
  "/",
  protectAdmin,
  createProduct
);

router.delete(
  "/:id",
  protectAdmin,
  deleteProduct
);


module.exports = router;