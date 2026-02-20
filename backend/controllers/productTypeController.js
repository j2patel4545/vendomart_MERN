import ProductType from "../models/ProductType.js";

/* ================= CREATE ================= */
export const createProductType = async (req, res) => {
  try {
    const { productTypeName, description } = req.body;

    const exists = await ProductType.findOne({ productTypeName });
    if (exists) {
      return res.status(400).json({ message: "Product Type already exists" });
    }

    const type_image = req.file
      ? `/${req.file.path.replace(/\\/g, "/")}`
      : "";

    const productType = await ProductType.create({
      productTypeName,
      description,
      type_image,
      createdBy: req.admin?._id,
    });

    res.status(201).json(productType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getAllProductTypes = async (req, res) => {
  const data = await ProductType.find().sort({ createdAt: -1 });
  res.json(data);
};

/* ================= GET BY ID ================= */
export const getProductTypeById = async (req, res) => {
  const data = await ProductType.findById(req.params.id);
  if (!data) {
    return res.status(404).json({ message: "Product Type not found" });
  }
  res.json(data);
};

/* ================= UPDATE ================= */
export const updateProductType = async (req, res) => {
  const productType = await ProductType.findById(req.params.id);

  if (!productType) {
    return res.status(404).json({ message: "Product Type not found" });
  }

  productType.productTypeName =
    req.body.productTypeName || productType.productTypeName;

  productType.description =
    req.body.description || productType.description;

  if (req.file) {
    productType.type_image = `/${req.file.path.replace(/\\/g, "/")}`;
  }

  const updated = await productType.save();
  res.json(updated);
};

/* ================= DELETE ================= */
export const deleteProductType = async (req, res) => {
  await ProductType.findByIdAndDelete(req.params.id);
  res.json({ message: "Product Type deleted successfully" });
};

/* ================= STATUS TOGGLE ================= */
export const toggleProductTypeStatus = async (req, res) => {
  const productType = await ProductType.findById(req.params.id);

  if (!productType) {
    return res.status(404).json({ message: "Product Type not found" });
  }

  productType.status = !productType.status;
  await productType.save();

  res.json({
    message: "Status updated",
    status: productType.status,
  });
};
