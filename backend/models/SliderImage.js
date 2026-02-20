import mongoose from "mongoose";

const sliderImageSchema = new mongoose.Schema(
  {
    productTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },

    sliderName: {
      type: String,
      required: true,
      trim: true,
    },

    slider_image: {
      type: String, // "/uploads/sliders/filename.png"
      required: true,
    },

    remark: {
      type: String,
      default: "",
    },

    status: {
      type: Boolean,
      default: true,
    },

    homepage: {
      type: Number, // 0 = not on homepage, 1 = show on homepage
      default: 0,
      enum: [0, 1],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SliderImage", sliderImageSchema);
