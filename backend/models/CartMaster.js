import mongoose from "mongoose";

const cartMasterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or your customer collection
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductMaster",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    price: {
      type: Number,
      required: true, // store price at time of adding to cart
    },

    discountPrice: {
      type: Number, // optional, in case product has discount
    },

    totalPrice: {
      type: Number, // quantity * (discountPrice || price)
    },

    status: {
      type: Boolean,
      default: true, // true = active in cart, false = removed/ordered
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // optional, for admin-added carts
    },
  },
  { timestamps: true }
);

export default mongoose.model("CartMaster", cartMasterSchema);
