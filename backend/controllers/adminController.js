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

module.exports = {
  getAllOrders,
  getDashboardStats,
};