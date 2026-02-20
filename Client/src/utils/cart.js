import axios from "axios";
import { getUser } from "./auth";

const CART_API = "http://localhost:9999/api/cart-master";

export const addToCart = async (productId, quantity = 1) => {
  const user = getUser();

  if (!user) throw new Error("NOT_LOGGED_IN");

  // API call
  await axios.post(CART_API, {
    userId: user._id,
    productId,
    quantity,
  });

  // LocalStorage sync
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(i => i.productId === productId);

  if (index >= 0) {
    cart[index].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};
