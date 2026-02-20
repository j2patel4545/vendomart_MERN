import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: "admin",
    },
    resetToken: String,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
