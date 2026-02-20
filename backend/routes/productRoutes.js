import express from "express";
// import { uploadProduct } from "../middleware/uploadMiddleware.js";
import { createProduct } from "../controllers/productController.js";
// import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", protectAdmin, uploadProduct.single("image"), createProduct);
export default router;
