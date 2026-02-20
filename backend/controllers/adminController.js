import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/* Generate JWT */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* ================= CREATE ADMIN ================= */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

 const image = req.file
  ? `/${req.file.path.replace(/\\/g, "/")}`
  : "";

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      image,
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

/* ================= PROFILE ================= */
export const getAdminProfile = async (req, res) => {
  res.json(req.admin);
};

/* ================= UPDATE ================= */
export const updateAdmin = async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  admin.name = req.body.name || admin.name;
  admin.email = req.body.email || admin.email;

  if (req.body.password) {
    admin.password = await bcrypt.hash(req.body.password, 10);
  }

  if (req.file) {
admin.image = `/${req.file.path.replace(/\\/g, "/")}`;
  }

  const updatedAdmin = await admin.save();
  res.json(updatedAdmin);
};

/* ================= DELETE ================= */
export const deleteAdmin = async (req, res) => {
  await Admin.findByIdAndDelete(req.admin._id);
  res.json({ message: "Admin deleted" });
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  admin.resetToken = resetToken;
  admin.resetTokenExpire = Date.now() + 10 * 60 * 1000;
  await admin.save();

  res.json({ message: "Reset token generated", resetToken });
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  const admin = await Admin.findOne({
    resetToken: req.params.token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!admin) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  admin.password = await bcrypt.hash(req.body.password, 10);
  admin.resetToken = undefined;
  admin.resetTokenExpire = undefined;
  await admin.save();

  res.json({ message: "Password reset successful" });
};
