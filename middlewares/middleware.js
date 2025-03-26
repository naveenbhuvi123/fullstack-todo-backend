import User from "../model/userModel.js"; // Ensure correct path
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // Check if token exists and starts with 'Bearer'
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    // Extract the token (remove 'Bearer ' prefix)
    token = token.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID and exclude password
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user data to req.user
    req.user = user;

    // Move to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
