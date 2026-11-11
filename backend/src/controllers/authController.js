





import bcrypt from "bcrypt";
import pool from "../config/db.js";
import jwt from "jsonwebtoken"; 
// REGISTER USER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    // 2. Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters.",
      });
    }

    // 3. Validate email
    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // 4. Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // 5. Check existing user
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 7. Insert user into PostgreSQL
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name.trim(), normalizedEmail, hashedPassword]
    );

    const user = result.rows[0];

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user,
    });

  } catch (error) {
    console.error("Register error:", error);

    // Handle concurrent duplicate registrations
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


// LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find user
    const result = await pool.query(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE LOWER(email) = $1`,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    // 3. Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Remove password hash
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: safeUser,
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, created_at
       FROM users
       WHERE id = $1`,
      [req.userId]
    );
    console.log("User profile result:", result.rows[0]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export { register, login, getProfile };