// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, nativeLanguage } = req.body;

    // Validation
    if (!name || !email || !password || !nativeLanguage) {
      return res.status(400).json({ 
        success: false, 
        message: "Please fill in all fields" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please login instead."
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique UID
    const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user
    const newUser = new User({
      uid: uid,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      nativeLanguage: { name: nativeLanguage.trim() },
      learningLanguages: []
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        uid: newUser.uid,
        email: newUser.email,
        name: newUser.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token: token,
      user: {
        uid: newUser.uid,
        name: newUser.name,
        email: newUser.email,
        nativeLanguage: newUser.nativeLanguage,
        learningLanguages: newUser.learningLanguages,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered."
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { 
        uid: user.uid,
        email: user.email,
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

   res.status(200).json({
  success: true,
  message: "Login successful",
  token: token,
  user: {
    uid: user.uid,
    name: user.name,
    email: user.email,
    nativeLanguage: user.nativeLanguage,
    learningLanguages: user.learningLanguages || []
  },
});
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// Update user languages
const updateUserLanguages = async (req, res) => {
  try {
    const { uid } = req.params;
    const { languageId, name, locale, code } = req.body;

    console.log("=== Update User Languages Request ===");
    console.log("UID:", uid);
    console.log("Request Body:", { languageId, name, locale, code });

    // Validate required fields
    if (!languageId || !name) {
      console.log("Missing required fields: languageId or name");
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields. Please provide languageId and name." 
      });
    }

    // Use either locale or code (prioritize locale, fallback to code)
    const finalLocale = locale || code;
    
    if (!finalLocale) {
      console.log("Missing locale/code field");
      return res.status(400).json({ 
        success: false, 
        message: "Missing locale/code. Please provide either locale or code." 
      });
    }

    // Find user by uid
    const user = await User.findOne({ uid });
    if (!user) {
      console.log("User not found with uid:", uid);
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("Found user:", user.email);
    console.log("Current learning languages count:", user.learningLanguages.length);

    // Check if language already exists in user's learning list
    const existingLanguageIndex = user.learningLanguages.findIndex(
      l => l.languageId && l.languageId.toString() === languageId
    );

    let message = "";
    
    if (existingLanguageIndex === -1) {

      user.learningLanguages.push({ 
        languageId, 
        name, 
        locale: finalLocale,
        level: "Beginner", 
        goal: 5,           
        addedAt: new Date()
      });
      message = "New learning language added successfully";
      console.log("Added new language with locale:", finalLocale);
      console.log("Default goal set to: 5 minutes");
    } else {
      // Language exists, update its details if needed
      const existingLang = user.learningLanguages[existingLanguageIndex];
      
      // Update fields if they're different
      if (existingLang.name !== name) {
        user.learningLanguages[existingLanguageIndex].name = name;
      }
      if (existingLang.locale !== finalLocale) {
        user.learningLanguages[existingLanguageIndex].locale = finalLocale;
      }
      
      message = "Existing learning language updated successfully";
      console.log("Updated existing language at index:", existingLanguageIndex);
    }

    // Save the user document
    await user.save();
    console.log("User saved successfully");

    // Get the updated learning languages
    const updatedLearningLanguages = user.learningLanguages;
    console.log("Updated learning languages count:", updatedLearningLanguages.length);

    // Get the most recently added/updated language
    const latestLanguage = updatedLearningLanguages[
      existingLanguageIndex === -1 
        ? updatedLearningLanguages.length - 1 
        : existingLanguageIndex
    ];

    // Success response
    res.status(200).json({
      success: true,
      message: message,
      learningLanguages: updatedLearningLanguages,
      latestLanguage: latestLanguage,
    });

  } catch (error) {
    console.error("=== Update Learning Language Error ===");
    console.error("Error details:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: "Validation error: " + error.message 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid data format" 
      });
    }

    // General server error
    res.status(500).json({ 
      success: false, 
      message: "Server error occurred while updating languages",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get current user profile
const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update user language details (level and goal)
const updateUserLanguageDetails = async (req, res) => {
  try {
    const { uid } = req.params;
    const { languageId, level, goal } = req.body;

    console.log("=== Update Language Details Request ===");
    console.log("UID:", uid);
    console.log("Language ID:", languageId);
    console.log("Level:", level);
    console.log("Goal:", goal);

    if (!languageId || !level || goal === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    // Convert goal to number if it's a string
    let goalInMinutes = goal;
    if (typeof goal === 'string') {
      // Map string values to minutes (just in case)
      const goalMap = {
        'Casual': 5,
        'Regular': 10,
        'Serious': 15,
        'Intense': 30
      };
      goalInMinutes = goalMap[goal] || parseInt(goal) || 5;
    }

    // Ensure goal is a number
    if (typeof goalInMinutes !== 'number' || isNaN(goalInMinutes)) {
      return res.status(400).json({
        success: false,
        message: "Goal must be a number (minutes)"
      });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Find the learning language and update its level and goal
    const languageIndex = user.learningLanguages.findIndex(
      l => l.languageId.toString() === languageId
    );

    if (languageIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Language not found in user's learning list" 
      });
    }

    // Update the language with level and goal (goal is now a number)
    user.learningLanguages[languageIndex].level = level;
    user.learningLanguages[languageIndex].goal = goalInMinutes; // Store as number

    await user.save();

    console.log("Updated language details:", {
      level: user.learningLanguages[languageIndex].level,
      goal: user.learningLanguages[languageIndex].goal
    });

    res.status(200).json({
      success: true,
      message: "Language details updated successfully",
      learningLanguages: user.learningLanguages
    });

  } catch (error) {
    console.error("Update language details error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Delete current user
const deleteCurrentUser = async (req, res) => {
  try {
    const uid = req.user.uid;

    const deletedUser = await User.findOneAndDelete({ uid });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting profile",
    });
  }
};


// Make sure to export the new functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getCurrentUserProfile,
  updateUserLanguages,
  updateUserLanguageDetails,
  deleteCurrentUser,
};

