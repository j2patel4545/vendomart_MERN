import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    image: req.file.path,
  });
  res.json(product);
};
