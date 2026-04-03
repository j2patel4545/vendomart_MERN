import OrderMaster from "../models/OrderMaster.js";
import User from "../models/User.js";
import ProductMaster from "../models/ProductMaster.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, totalPrice, address, userId } = req.body;
    
    // Fallback if userId is not in the request body
    const orderUserId = userId || (req.user ? req.user._id : null);

    if (!orderUserId) {
      return res.status(400).json({ message: "User ID is required to place an order." });
    }

    const order = new OrderMaster({
      userId: orderUserId,
      productId,
      quantity,
      totalPrice,
      address,
    });
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Public
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderMaster.find()
      .populate("userId", "name email")
      .populate("productId", "productName image")
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's orders (Client)
// @route   GET /api/orders/my-orders
// @access  Public
export const getUserOrders = async (req, res) => {
  try {
    // In No-Auth mode, we expect userId to be passed in the request query or body
    const userId = req.query.userId || (req.user ? req.user._id : null);
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const orders = await OrderMaster.find({ userId })
      .populate("productId", "productName image")
      .sort("-updatedAt"); 
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/orders/:id/status
// @access  Public
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderMaster.findById(req.params.id);
    if (order) {
      order.status = status;
      order.isRead = false; 
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(400).json({ message: `Status update failed: ${error.message}` });
  }
};

// @desc    Mark order as read (Client)
// @route   PATCH /api/orders/:id/read
// @access  Public
export const markOrderAsRead = async (req, res) => {
    try {
      const order = await OrderMaster.findById(req.params.id);
      if (order) {
        order.isRead = true;
        await order.save();
        res.json({ message: "Order marked as read" });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
