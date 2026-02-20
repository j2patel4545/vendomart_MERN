import ProductMaster from "../models/ProductMaster.js";

/* ================= CREATE ================= */
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productCode,
      productTypeId,
      description,
      price,
      discountPrice,
      stockQuantity,
      status,
      isFeatured,
      isTopOffer,
    } = req.body;

    // Check unique productCode
    const existing = await ProductMaster.findOne({ productCode });
    if (existing) {
      return res.status(400).json({ message: "Product Code already exists" });
    }

    let imagePath;
    if (req.file) {
      imagePath = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const product = await ProductMaster.create({
      productName,
      productCode,
      productTypeId,
      description,
      price,
      discountPrice,
      stockQuantity,
      status: status !== undefined ? status : true,
      isFeatured: isFeatured ? Number(isFeatured) : 0,
      isTopOffer: isTopOffer ? Number(isTopOffer) : 0,
      image: imagePath,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getAllProducts = async (req, res) => {
  const products = await ProductMaster.find()
    .populate("productTypeId", "productTypeName")
    .sort({ createdAt: -1 });

  res.json(products);
};

/* ================= GET BY ID ================= */
export const getProductById = async (req, res) => {
  const product = await ProductMaster.findById(req.params.id)
    .populate("productTypeId", "productTypeName");

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
};

/* ================= GET BY PRODUCT TYPE ================= */
export const getProductsByType = async (req, res) => {
  const { productTypeId } = req.params;
  const products = await ProductMaster.find({ productTypeId, status: true })
    .populate("productTypeId", "productTypeName")
    .sort({ createdAt: -1 });

  res.json(products);
};

/* ================= GET FEATURED PRODUCTS ================= */
export const getFeaturedProducts = async (req, res) => {
  const products = await ProductMaster.find({ isFeatured: 1, status: true })
    .populate("productTypeId", "productTypeName")
    .sort({ createdAt: -1 });

  res.json(products);
};

/* ================= GET TOP OFFERS ================= */
export const getTopOfferProducts = async (req, res) => {
  const products = await ProductMaster.find({ isTopOffer: 1, status: true })
    .populate("productTypeId", "productTypeName")
    .sort({ createdAt: -1 });

  res.json(products);
};

/* ================= UPDATE ================= */
export const updateProduct = async (req, res) => {
  const product = await ProductMaster.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const {
    productName,
    productCode,
    productTypeId,
    description,
    price,
    discountPrice,
    stockQuantity,
    status,
    isFeatured,
    isTopOffer,
  } = req.body;

  product.productName = productName || product.productName;
  product.productCode = productCode || product.productCode;
  product.productTypeId = productTypeId || product.productTypeId;
  product.description = description || product.description;
  product.price = price !== undefined ? price : product.price;
  product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
  product.stockQuantity = stockQuantity !== undefined ? stockQuantity : product.stockQuantity;
  product.status = status !== undefined ? status : product.status;
  product.isFeatured = isFeatured !== undefined ? Number(isFeatured) : product.isFeatured;
  product.isTopOffer = isTopOffer !== undefined ? Number(isTopOffer) : product.isTopOffer;

  if (req.file) {
    product.image = `/${req.file.path.replace(/\\/g, "/")}`;
  }

  const updated = await product.save();
  res.json(updated);
};

/* ================= DELETE ================= */
export const deleteProduct = async (req, res) => {
  await ProductMaster.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted successfully" });
};

/* ================= STATUS TOGGLE ================= */
export const toggleProductStatus = async (req, res) => {
  const product = await ProductMaster.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.status = !product.status;
  await product.save();

  res.json({ message: "Status updated", status: product.status });
};
