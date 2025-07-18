import express from "express";
import Metric from "../models/Metric.js";
import authMiddleware from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

// Helper function to calculate statistics
const getStats = (values) => {
  if (!values || values.length === 0) {
    return { total: 0, avg: 0, min: 0, max: 0, std: 0 };
  }
  const total = values.reduce((a, b) => a + b, 0);
  const avg = total / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const std = Math.sqrt(
    values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) /
      values.length
  );
  return {
    total: total.toFixed(2),
    avg: avg.toFixed(2),
    min: min.toFixed(2),
    max: max.toFixed(2),
    std: std.toFixed(2),
  };
};

// Helper function to construct the prompt for the AI
const constructPrompt = (metrics) => {
    const grouped = {};
    metrics.forEach(({ category = "General", value }) => {
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(value);
    });

    const categorySummaries = Object.entries(grouped).map(
      ([category, values]) => {
        const { total, avg, min, max, std } = getStats(values);
        return `${category} ➤ Total: ${total}, Avg: ${avg}, Max: ${max}, Min: ${min}, Std Dev: ${std}`;
      }
    );

    const sorted = [...metrics].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 3).map((m) => `${m.name} (${m.value})`);
    const bottom = sorted.slice(-3).map((m) => `${m.name} (${m.value})`);

    return `
You are a senior data analyst at a SaaS analytics platform. Here is the metric data for a client dashboard:

- Metric Distribution by Category:
${categorySummaries.join("\n")}

- Top 3 Performing Metrics:
${top.join(", ")}

- Bottom 3 Performing Metrics:
${bottom.join(", ")}

Your task is to provide a detailed, business-professional analysis in JSON format. The JSON object should have the following structure:
{
  "executiveSummary": "A 2-3 sentence overview of the key findings.",
  "performanceHighlights": {
    "topCategory": {
      "name": "Category Name",
      "insight": "A brief insight into why this category is performing well, referencing its average score."
    },
    "bottomCategory": {
      "name": "Category Name",
      "insight": "A brief insight into why this category is underperforming, referencing its average score."
    }
  },
  "keyTrends": [
    "A bullet point identifying a significant trend, like a performance gap or high variance.",
    "Another bullet point for another trend."
  ],
  "actionableRecommendations": [
    {
      "title": "A short, actionable title for the recommendation.",
      "description": "A 1-2 sentence description of the recommended action, tied directly to the data."
    },
    {
      "title": "Another recommendation title.",
      "description": "Another recommendation description."
    }
  ]
}

- Analyze the provided statistics (Avg, Std Dev) to inform your insights.
- For 'performanceHighlights', identify the categories with the highest and lowest average values.
- For 'keyTrends', look for significant variances, performance gaps, or concentrations of high/low metrics.
- For 'actionableRecommendations', suggest concrete steps the user can take based on the data.

Do not include any introductory phrases. Output only the raw JSON object.
`;
}

// The main route handler, now without caching
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const metrics = await Metric.find({ user: userId });

    if (!metrics.length) {
      return res.status(200).json({ summary: { executiveSummary: "No metrics found. Add some data to generate a summary." } });
    }

    const prompt = constructPrompt(metrics);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are a helpful analytics assistant that responds in JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );
    
    let summaryObject;
    try {
        const rawContent = response.data.choices[0].message.content;
        summaryObject = JSON.parse(rawContent);
    } catch (parseError) {
        console.error("🔴 FAILED TO PARSE JSON FROM GROQ API");
        console.error("RAW AI RESPONSE:", response.data.choices[0].message.content);
        return res.status(500).json({ error: "The AI returned an invalid format." });
    }
    
    res.json({ summary: summaryObject });
  } catch (err) {
    console.error("❌ ERROR IN /summary ROUTE:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to communicate with AI service or database." });
  }
});

export default router;