import express from "express";
import { searchProductsAndTypes } from "../controllers/SearchControler.js";

const router = express.Router();

/* ================= SEARCH PRODUCTS & TYPES ================= */
router.get("/", searchProductsAndTypes);

export default router;
