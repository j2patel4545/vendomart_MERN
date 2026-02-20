import UserMaster from "../models/UserMaster.js";
import jwt from "jsonwebtoken";

/* ================= GENERATE TOKEN ================= */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

export const registerUser = async (req, res) => {
  try {
    console.log("register");
    
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, and password are required" });

    const userExists = await UserMaster.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    let profileImage = "";
    if (req.file) {
      profileImage = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const user = await UserMaster.create({
      name,
      email,
      password,
      phone,
      address,
      profileImage,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    // ✅ LOCAL ERROR HANDLING
    res.status(500).json({ message: error.message });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserMaster.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Direct comparison since no hashing
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET USER PROFILE ================= */
export const getUserProfile = async (req, res) => {
  if (!req.user)
    return res.status(404).json({ message: "User not found" });

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    address: req.user.address,
    profileImage: req.user.profileImage,
    status: req.user.status,
  });
};

/* ================= GET ALL USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserMaster.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= DELETE USER ================= */
export const deleteUser = async (req, res) => {
  try {
    const user = await UserMaster.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= UPDATE USER ================= */
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, status } = req.body;

    const user = await UserMaster.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (status !== undefined) user.status = status;

    // ✅ Update password ONLY if provided
    if (password) {
      user.password = password; // (no hashing as per current setup)
    }

    // ✅ Update image if uploaded
    if (req.file) {
      user.profileImage = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const updatedUser = await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
