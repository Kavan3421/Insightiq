import express from "express";
import Metric from "../models/Metric.js";
import authMiddleware from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const router = express.Router();

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const metrics = await Metric.find({ userId });

    if (!metrics.length) {
      return res.status(404).json({ message: "No metrics found" });
    }

    const formatted = metrics.map(m => `${m.name}: ${m.value}`).join(", ");

    const prompt = `You are a data analyst. Given these user metrics: ${formatted}. Write a short summary of performance trends, top metrics, or insights in 2-3 sentences.`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192", // Groq supported model
        messages: [
          { role: "system", content: "You are a helpful analytics assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const summary = response.data.choices[0].message.content;
    res.json({ summary });

  } catch (err) {
    console.error("Groq API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

export default router;
