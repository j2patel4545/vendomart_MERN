import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No token" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = await Admin.findById(decoded.id).select("-password");
    if (!req.admin) {
      return res.status(401).json({ message: "Admin not found" });
    }
    next();
  } catch (error) {
    console.error("protectAdmin Error:", error.message);
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};
