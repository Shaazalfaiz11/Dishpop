import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

// Use bcrypt with constant-time compare
const bcrypt = bcryptjs;

// ▓▓▓ OPTIONAL: Simple in-memory rate limiter (protects from brute force) ▓▓▓
const loginAttempts = new Map();
const MAX_ATTEMPTS = 10;       // per minute
const WINDOW_MS = 60 * 1000;   // 1 minute

function rateLimit(ip) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || [];
  const filtered = attempts.filter(t => now - t < WINDOW_MS);

  if (filtered.length >= MAX_ATTEMPTS) return false;

  filtered.push(now);
  loginAttempts.set(ip, filtered);
  return true;
}

// ▓▓▓ PRODUCTION-READY ADMIN LOGIN ▓▓▓
export const adminLogin = async (req, res) => {
  try {
    const ip = req.ip;

    // ▓▓▓ RATE LIMIT: prevents brute force ▓▓▓
    if (!rateLimit(ip)) {
      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Try again later."
      });
    }

    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });

    // ▓▓▓ Find admin (cached version optional) ▓▓▓
    const admin = await Admin.findOne({ email }).lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // ▓▓▓ Secure password check ▓▓▓
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ▓▓▓ Generate JWT (high-security) ▓▓▓
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.ADMIN_JWT_SECRET,
      {
        expiresIn: "1d",
        algorithm: "HS256"
      }
    );

    // ▓▓▓ Send Success Response ▓▓▓
    return res.json({
      success: true,
      token,
    });

  } catch (error) {
    console.error("🔥 Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
