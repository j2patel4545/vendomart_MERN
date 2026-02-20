// models/ProductMaster.js
import mongoose from "mongoose";

const productMasterSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productCode: {
      type: String,
      required: true,
      unique: true,
    },
    productTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Number, // 0 = no, 1 = yes
      default: 0,
      enum: [0, 1],
    },
    isTopOffer: {
      type: Number, // 0 = no, 1 = yes
      default: 0,
      enum: [0, 1],
    },
    image: {
      type: String, // "/uploads/products/filename.png"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

// Register model
export default mongoose.model("ProductMaster", productMasterSchema);
