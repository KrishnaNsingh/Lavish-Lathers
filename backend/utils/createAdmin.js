require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");

const Admin = require("../models/Admin");

const createAdmin = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(
      "lavishleather@2026",
      10
    );

    const adminExists = await Admin.findOne({
      email: "admin@lavishlathers.in",
    });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await Admin.create({
      email: "admin@lavishlathers.in",
      password: hashedPassword,
    });

    console.log("Admin created:");
    console.log(admin);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();