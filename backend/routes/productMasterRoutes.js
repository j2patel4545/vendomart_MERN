import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getProductsByType,
  getFeaturedProducts,
  getTopOfferProducts,
} from "../controllers/productMasterController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadProductImage } from "../middleware/productImageUploadMiddleware.js";

const router = express.Router();

/* ================= CREATE ================= */
router.post(
  "/",
  // protectAdmin, // Uncomment if you want only admins to create
  uploadProductImage.single("image"),
  createProduct
);

/* ================= READ ================= */
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Filtered routes
router.get("/product-type/:productTypeId", getProductsByType);
router.get("/featured", getFeaturedProducts);
router.get("/top-offers", getTopOfferProducts);

/* ================= UPDATE ================= */
router.put(
  "/:id",
  // protectAdmin, // Only admin can update
  uploadProductImage.single("image"),
  updateProduct
);

/* ================= DELETE ================= */
router.delete("/:id", 
  // protectAdmin, 
  deleteProduct);

/* ================= STATUS TOGGLE ================= */
router.patch("/status/:id",
  //  protectAdmin, 
   toggleProductStatus);

export default router;
