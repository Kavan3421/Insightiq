import express from "express";
import Metric from "../models/Metric.js";
import authMiddleware from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
import axios from "axios";
// import NodeCache from "node-cache"; // 1. REMOVE THIS LINE

dotenv.config();

const router = express.Router();

// const summaryCache = new NodeCache({ stdTTL: 600 }); // 2. REMOVE THIS LINE

// (Keep the getStats and constructPrompt functions as they are)
const getStats = (values) => {
  // ... (this function is correct, no changes needed)
};

const constructPrompt = (metrics) => {
    // ... (this function is correct, no changes needed)
}


router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    // const cacheKey = `summary_${userId}`; // 3. REMOVE THIS LINE

    // 4. REMOVE THIS ENTIRE "if" BLOCK
    // const cachedSummary = summaryCache.get(cacheKey);
    // if (cachedSummary) {
    //   console.log("Returning cached summary for user:", userId);
    //   return res.json({ summary: cachedSummary });
    // }

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
    
    // summaryCache.set(cacheKey, summaryObject); // 5. REMOVE THIS LINE

    res.json({ summary: summaryObject });
  } catch (err) {
    console.error("❌ ERROR IN /summary ROUTE:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to communicate with AI service or database." });
  }
});

export default router;