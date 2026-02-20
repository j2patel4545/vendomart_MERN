import mongoose from "mongoose";

const productTypeSchema = new mongoose.Schema(
  {
    productTypeName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    type_image: {
      type: String, // stores "/uploads/product-types/filename.png"
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProductType", productTypeSchema);
