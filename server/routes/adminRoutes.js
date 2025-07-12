import express from "express";

import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
const router = express.Router();

router.get("/admin/users", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;