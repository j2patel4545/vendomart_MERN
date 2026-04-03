import express from "express";
import {
  createSliderImage,
  getAllSliderImages,
  getSliderImageById,
  updateSliderImage,
  deleteSliderImage,
  toggleSliderStatus,
  getHomepageSliders,          // 🔹 added
  getSlidersByProductType,     // 🔹 added
} from "../controllers/sliderImageController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadSliderImage } from "../middleware/sliderImageUploadMiddleware.js";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  // protectAdmin, // currently commented out
  uploadSliderImage.single("slider_image"),
  createSliderImage
);

/* READ */
router.get("/", getAllSliderImages);
router.get("/:id", getSliderImageById);

// 🔹 Get all homepage sliders
router.get("/homepage", getHomepageSliders);

// 🔹 Get sliders by product type
router.get("/product-type/:productTypeId", getSlidersByProductType);

/* UPDATE */
router.put(
  "/:id",
  // protectAdmin,
  uploadSliderImage.single("slider_image"),
  updateSliderImage
);

/* DELETE */
router.delete("/:id", deleteSliderImage);

/* STATUS */
router.patch("/status/:id", protectAdmin, toggleSliderStatus);

export default router;
