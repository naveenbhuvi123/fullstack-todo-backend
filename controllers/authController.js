import User from "../model/userModel.js"; // Importing User Model (Schema)
import jwt from "jsonwebtoken"; // Importing JWT for authentication
import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing
import dotenv from "dotenv"; // Importing dotenv to use environment variables

dotenv.config(); // Load environment variables from .env file
const SALT_ROUNDS = 10; // Number of salt rounds for password hashing



// ============================
// 🔹 Register User Function
// ============================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Extracting user input from request body

    //  [DEBUG STEP 1] Ensure all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
if (!passwordRegex.test(password)) {
  return res.status(400).json({ 
    message: "Password must have at least 8 characters, 1 uppercase, 1 number, and 1 special character." 
  });
}


    //  [DEBUG STEP 2] Validate password length
    if (password.length < 8 && password.length > 64) {
      return res.status(400).json({ message: "Password must be at least 8 characters " });
    }

    if (password.length > 64) {
        return res.status(400).json({ message: "Password cannot exceed 64 characters." });
      }
      

    //  [DEBUG STEP 3] Check if the user already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }


    //  **[IMPORTANT FIX] Hashing the password before saving**
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log("🔹 Registering User:", email);
    console.log("🔹 Original Password:", password);
    console.log("🔹 Hashed Password:", hashedPassword);

    //  **Creating and saving user in the database**
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Storing only the hashed password
    });
    console.log("🔹 Stored Hashed Password in DB:", newUser.password);
 
    //  **Generating JWT Token after successful registration**
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET, // Using secret from .env file
      { expiresIn: "30d" } // Token expires in 30 days
    );

    //  **Sending success response**
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });


  } catch (error) {
    console.error(" Error in Register:", error.message); // Log errors
    res.status(500).json({ message: error.message }); // Handle internal server errors
  }
};

// ============================
// 🔹 Login User Function
// ============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract user input

    //  [DEBUG STEP 1] Ensure email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length > 64) {
        return res.status(400).json({ message: "Password cannot exceed 64 characters." });
      }
      

   
    //  [DEBUG STEP 2] Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🔹 User Trying to Login:", email);
    console.log("🔹 Entered Password:", password);
    console.log("🔹 Stored Hashed Password from DB:", user.password);

    //  **[IMPORTANT FIX] Comparing entered password with hashed password**
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("🔹 Password Match Result:", isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
  
    //  **Generating JWT Token after successful login**
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    //  **Sending success response**
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error(" Error in Login:", error.message); // Log errors
    res.status(500).json({ message: error.message }); // Handle internal server errors
  }
};

export default { registerUser, loginUser }; // Exporting functions for use in routes
