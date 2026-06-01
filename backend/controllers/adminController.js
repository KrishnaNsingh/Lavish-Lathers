// controllers/adminController.js

const Order = require("../models/Order");
const Product = require("../models/Product");
const ExcelJS = require("exceljs");


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

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          orderStatus: status,
        },
        {
          new: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const exportOrdersExcel = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find().sort({
        createdAt: -1,
      });

    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Orders"
      );

    worksheet.columns = [
      {
        header: "Customer",
        key: "customer",
        width: 25,
      },
      {
        header: "Email",
        key: "email",
        width: 30,
      },
      {
        header: "Phone",
        key: "phone",
        width: 20,
      },
      {
        header: "Address",
        key: "address",
        width: 40,
      },
      {
        header: "Products",
        key: "products",
        width: 40,
      },
      {
        header: "Total",
        key: "total",
        width: 15,
      },
      {
        header: "Payment",
        key: "payment",
        width: 15,
      },
      {
        header: "Order Status",
        key: "status",
        width: 15,
      },
      {
        header: "Date",
        key: "date",
        width: 25,
      },
    ];

    orders.forEach((order) => {
      worksheet.addRow({
        customer:
          order.customer.name,

        email:
          order.customer.email,

        phone:
          order.customer.phone,

        address: `
${order.shippingAddress.street},
${order.shippingAddress.city},
${order.shippingAddress.state},
${order.shippingAddress.postalCode}
        `,

        products: order.items
          .map(
            (item) =>
              `${item.name} x ${item.quantity}`
          )
          .join(", "),

        total:
          order.pricing.total,

        payment:
          order.payment
            .paymentStatus,

        status:
          order.orderStatus,

        date:
          order.createdAt.toLocaleString(),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="orders.xlsx"'
    );

    await workbook.xlsx.write(
      res
    );

    res.end();
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getDashboardStats,
  updateOrderStatus,
  exportOrdersExcel,
};