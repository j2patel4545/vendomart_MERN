import ProductMaster from "../models/ProductMaster.js";
import ProductType from "../models/ProductType.js";

/* ================= SEARCH PRODUCTS & TYPES ================= */
export const searchProductsAndTypes = async (req, res) => {
  try {
    const { query } = req.query; // search term from query param
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Regex for case-insensitive partial match
    const regex = new RegExp(query, "i");

    // Search Products
    const products = await ProductMaster.find({
      $or: [
        { productName: regex },
        { productCode: regex },
        { description: regex }
      ]
    }).populate("productTypeId", "productTypeName")
      .sort({ createdAt: -1 });

    // Search Product Types
    const productTypes = await ProductType.find({
      $or: [
        { productTypeName: regex },
        { description: regex }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      products,
      productTypes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
