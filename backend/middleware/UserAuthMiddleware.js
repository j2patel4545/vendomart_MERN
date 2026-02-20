import jwt from "jsonwebtoken";
import UserMaster from "../models/UserMaster.js";

export const UserAuthMiddleware = async (req, res, next) => {
  let token;

  try {
    // Check for Bearer token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object
      const user = await UserMaster.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;

      return next(); // ✅ always call next if auth succeeds
    }

    // No token provided
    return res.status(401).json({ message: "Not authorized, no token provided" });
  } catch (error) {
    console.error("UserAuthMiddleware error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
