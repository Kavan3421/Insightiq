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

    // Group metrics by category
    const grouped = {};
    metrics.forEach(({ category = "General", value }) => {
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(value);
    });

    const getStats = (values) => {
      const total = values.reduce((a, b) => a + b, 0);
      const avg = (total / values.length).toFixed(2);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const std = Math.sqrt(
        values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) /
          values.length
      ).toFixed(2);
      return { total, avg, min, max, std };
    };

    const categorySummaries = Object.entries(grouped).map(
      ([category, values]) => {
        const { total, avg, min, max, std } = getStats(values);
        return `${category} ➤ Total: ${total}, Avg: ${avg}, Max: ${max}, Min: ${min}, Std Dev: ${std}`;
      }
    );

    // Top 3 and bottom 3 metrics
    const sorted = [...metrics].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 3).map((m) => `${m.name} (${m.value})`);
    const bottom = sorted.slice(-3).map((m) => `${m.name} (${m.value})`);

    // Construct prompt
    const prompt = `
You are a senior data analyst at a SaaS analytics platform. Here is the metric data for a client dashboard:

🧠 Metric Distribution by Category:
${categorySummaries.join("\n")}

📈 Top 3 Performing Metrics:
${top.join(", ")}

📉 Bottom 3 Performing Metrics:
${bottom.join(", ")}

Your task:
1. Identify key trends (growth/decline) in the metrics.
2. Highlight which categories are performing best and which are lagging.
3. Suggest 1–2 strategic actions the user can take.
4. Write it in a business-professional tone in 4–6 sentences.

Start with a summary statement, followed by analysis and recommendations.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are a senior analytics consultant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
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
    res.status(500).json({ error: "Failed to generate advanced summary" });
  }
});

export default router;
