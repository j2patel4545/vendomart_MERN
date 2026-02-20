import express from "express";
import {
  registerAdmin,
  loginAdmin,
} from "../controllers/adminAuthController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Example protected route
router.get("/profile", protectAdmin, (req, res) => {
  res.json(req.admin);
});

export default router;
