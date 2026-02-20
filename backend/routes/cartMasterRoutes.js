import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearUserCart,
} from "../controllers/cartMasterController.js";


const router = express.Router();

/* ADD TO CART */
router.post("/", addToCart);

/* GET USER CART */
router.get("/:userId", getUserCart);

/* UPDATE CART ITEM */
router.put("/:id", updateCartItem);

/* REMOVE CART ITEM */
router.delete("/:id", removeCartItem);

/* CLEAR USER CART */
router.delete("/clear/:userId", clearUserCart);

export default router;
