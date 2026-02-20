import CartMaster from "../models/CartMaster.js";
import ProductMaster from "../models/ProductMaster.js";

/* ================= ADD TO CART ================= */
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "User and Product are required" });
    }

    // Get product details
    const product = await ProductMaster.findById(productId);
    if (!product || !product.status) {
      return res.status(404).json({ message: "Product not found or inactive" });
    }

    const cartItem = await CartMaster.create({
      userId,
      productId,
      quantity: quantity || 1,
      price: product.price,
      discountPrice: product.discountPrice,
      totalPrice: (quantity || 1) * (product.discountPrice || product.price),
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET USER CART ================= */
export const getUserCart = async (req, res) => {
  const { userId } = req.params;

  const cartItems = await CartMaster.find({ userId, status: true })
    .populate("productId", "productName price discountPrice image")
    .sort({ createdAt: -1 });

  res.json(cartItems);
};

/* ================= UPDATE CART ITEM ================= */
export const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const cartItem = await CartMaster.findById(id);
  if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

  cartItem.quantity = quantity || cartItem.quantity;
  cartItem.totalPrice = cartItem.quantity * (cartItem.discountPrice || cartItem.price);

  const updated = await cartItem.save();
  res.json(updated);
};

/* ================= REMOVE CART ITEM ================= */
export const removeCartItem = async (req, res) => {
  const { id } = req.params;

  const cartItem = await CartMaster.findById(id);
  if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

  // Soft delete
  cartItem.status = false;
  await cartItem.save();

  res.json({ message: "Cart item removed successfully" });
};

/* ================= CLEAR USER CART ================= */
export const clearUserCart = async (req, res) => {
  const { userId } = req.params;

  await CartMaster.updateMany({ userId, status: true }, { status: false });

  res.json({ message: "Cart cleared successfully" });
};
