import express from "express";

const router = express.Router();
router.put("/:id/profile", uploadUser.single("profile"), uploadProfile);
export default router;
