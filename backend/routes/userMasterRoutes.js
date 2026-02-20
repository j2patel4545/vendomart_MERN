import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/userMasterController.js";

import uploadUserImage from "../middleware/userImageUploadMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  uploadUserImage.single("profileImage"),
  registerUser
);

router.post("/login", loginUser);
router.get("/profile", getUserProfile);
router.get("/", getAllUsers);
router.delete("/:id", deleteUser); // ✅ DELETE
router.put(
  "/:id",
  uploadUserImage.single("profileImage"),
  updateUser
);



export default router;
