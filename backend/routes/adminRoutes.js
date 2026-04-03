import express from "express";
import {
  createAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
  getAdminProfile,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
} from "../controllers/adminController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadAdminImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* Register with image */
router.post(
  "/register",
  uploadAdminImage.single("image"), // ⭐ field name MUST be "image"
  createAdmin
);

router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/profile",
   protectAdmin, 
   getAdminProfile);

router.get("/dashboard-stats", getDashboardStats);

router.put(
  "/profile",
  protectAdmin,
  uploadAdminImage.single("image"),
  updateAdmin
);

router.delete("/profile", protectAdmin, deleteAdmin);

export default router;
