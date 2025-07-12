import express from "express";
import Metric from "../models/Metric.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ Correct import

const router = express.Router();

// GET /api/dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const metrics = await Metric.find({ user: userId });

    const user = await User.findById(userId).select("name email");

    res.json({
      message: "Personal dashboard",
      metrics,
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/metrics
router.post("/metrics", authMiddleware, async (req, res) => {
  const { name, value, category = "General", date = new Date() } = req.body;

  try {
    const metric = await Metric.create({
      name,
      value,
      category,
      date,
      user: req.user.id, // ✅ Now works because middleware sets req.user
    });

    res.json({ metric });
  } catch (err) {
    console.error("Error adding metric:", err);
    res.status(500).json({ message: "Error adding metric" });
  }
});

// Update metric name
router.put("/metrics/:id", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const metric = await Metric.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name },
      { new: true }
    );

    if (!metric) return res.status(404).json({ message: "Metric not found" });

    res.json({ metric });
  } catch (err) {
    console.error("Error updating metric:", err);
    res.status(500).json({ message: "Failed to update metric" });
  }
});


// (Optional) Add sample data
router.post("/add-metrics", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const sample = [
    { user: userId, name: "Page Views", value: 123 },
    { user: userId, name: "New Signups", value: 45 },
    { user: userId, name: "Report Downloads", value: 12 }
  ];

  await Metric.insertMany(sample);

  res.json({ message: "Sample metrics added." });
});

export default router;
