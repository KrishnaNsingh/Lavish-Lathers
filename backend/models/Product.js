const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    registryId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    detailedDescription: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      enum: ["Herbal Soaps", "Essential Oils", "Gift Boxes", "Souvenirs"],
      required: true,
    },

    artistryType: {
      type: String,
      enum: ["Skincare formulation", "Keepsake Souvenir"],
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    souvenir: {
      type: Boolean,
      default: false,
    },

    ingredients: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    customMessageAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
