import mongoose from "mongoose";

const orderMasterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductMaster",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      fullName: String,
      mobile: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
      fullAddress: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    isRead: {
      type: Boolean,
      default: false, // For customer notification tracking
    }
  },
  { timestamps: true }
);

export default mongoose.model("OrderMaster", orderMasterSchema);
