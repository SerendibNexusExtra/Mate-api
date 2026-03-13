// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // 2. Extract token from "Bearer <token>"
    const token = authHeader.replace("Bearer ", "");

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    
    // 4. Attach user info to request object
    req.user = decoded;
    
    // 5. Continue to next middleware/controller
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token."
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again."
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Authentication failed."
    });
  }
};

// Optional: Admin middleware
const adminMiddleware = async (req, res, next) => {
  try {
    // First check if user is authenticated
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    
    // Check if user is admin (you can add a role field to your User model)
    // For now, let's assume all users can access, or you can implement role-based access
    req.user = decoded;
    
    // If you have roles in your User model:
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied. Admin privileges required."
    //   });
    // }
    
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed."
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware // optional
};