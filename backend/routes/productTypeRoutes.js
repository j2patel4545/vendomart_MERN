import express from "express";
import {
  createProductType,
  getAllProductTypes,
  getProductTypeById,
  updateProductType,
  deleteProductType,
  toggleProductTypeStatus,
} from "../controllers/productTypeController.js";

import { uploadProductTypeImage } from "../middleware/productTypeUploadMiddleware.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const uploadWithErrorHandling = (req, res, next) => {
  uploadProductTypeImage.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

/* CREATE */
router.post("/",
  //  protectAdmin,
    uploadWithErrorHandling, createProductType);

/* READ */
router.get("/", getAllProductTypes);
router.get("/:id", getProductTypeById);

/* UPDATE */
router.put("/:id", 
  // protectAdmin, 
  uploadWithErrorHandling, updateProductType);

/* DELETE */
router.delete("/:id", protectAdmin, deleteProductType);

/* STATUS TOGGLE */
router.patch("/status/:id", protectAdmin, toggleProductTypeStatus);

export default router;
