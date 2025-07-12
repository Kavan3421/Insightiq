import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
const router = express.Router();

router.post("/create-admin", async (req, res) => {
  try {
    const existing = await User.findOne({ email: "admin@example.com" });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash("Admin@123", 10);

    const admin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: hashed,
      role: "admin", // ✅ only route where admin role is allowed
    });

    await admin.save();
    res.json({ message: "Admin created", credentials: { email: "admin@example.com", password: "Admin@123" } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
