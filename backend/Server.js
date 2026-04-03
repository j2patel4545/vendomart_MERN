import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";

import connectDB from "./config/db.js";
import AdminRoutes from "./routes/adminRoutes.js";
import ProductTypeRoutes from "./routes/productTypeRoutes.js";
import sliderImageRoutes from "./routes/sliderImageRoutes.js";
import productMasterRoutes from "./routes/productMasterRoutes.js";
import cartMasterRoutes from "./routes/cartMasterRoutes.js";
import userMasterRoutes from "./routes/userMasterRoutes.js";
import SearchRouter from './routes/SearchRouter.js';
import orderMasterRoutes from './routes/orderMasterRoutes.js';

dotenv.config();
connectDB();

const app = express();
const __dirname = path.resolve();

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Upload folders */
const uploadDirs = [
  "uploads/admins",
  "uploads/sliders",
  "uploads/products",
  "uploads/users",
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* Static */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* Routes — ❌ NO () */
app.use("/api/admin", AdminRoutes);
app.use("/api/product-type", ProductTypeRoutes);
app.use("/api/slider-images", sliderImageRoutes);
app.use("/api/product-master", productMasterRoutes);
app.use("/api/cart-master", cartMasterRoutes);
app.use("/api/users", userMasterRoutes);
app.use('/api/search', SearchRouter);
app.use('/api/orders', orderMasterRoutes);





const PORT = process.env.PORT || 9999;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
