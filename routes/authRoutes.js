const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserLanguages,
  getCurrentUserProfile,
  updateUserLanguageDetails,
  deleteCurrentUser, // add this
} = require("../controllers/authController");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile/:uid", authMiddleware, getUserProfile);
router.get("/me", authMiddleware, getCurrentUserProfile);

router.put("/languages/:uid", authMiddleware, updateUserLanguages);
router.put("/languages/:uid/details", authMiddleware, updateUserLanguageDetails);

// delete current logged-in user
router.delete("/me", authMiddleware, deleteCurrentUser);

module.exports = router;