// controllers/adminController.js

const Order = require("../models/Order");
const Product = require("../models/Product");


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const totalRevenue =
      await Order.aggregate([
        {
          $match: {
            "payment.paymentStatus": "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$pricing.total",
            },
          },
        },
      ]);

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue:
        totalRevenue[0]?.total || 0,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created",
      product,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated",
      product,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      id: req.params.id,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  getAllOrders,
  getDashboardStats,

  createProduct,
  updateProduct,
  deleteProduct,
};