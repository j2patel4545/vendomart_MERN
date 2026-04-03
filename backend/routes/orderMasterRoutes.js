import express from "express";
import { 
  createOrder, getAllOrders, getUserOrders, updateOrderStatus, markOrderAsRead 
} from "../controllers/orderMasterController.js";
// import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/all", getAllOrders);
router.get("/my-orders",getUserOrders);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/read", markOrderAsRead);

export default router;
