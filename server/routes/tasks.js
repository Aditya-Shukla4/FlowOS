const express = require("express");
const router = express.Router();
const Task = require("../models/Task"); // Tera Mongoose model

// POST /api/tasks/extract -> Raw text se tasks nikalo aur DB mein save karo
router.post("/extract", async (req, res) => {
  try {
    const { rawInput } = req.body;
    if (!rawInput)
      return res.status(400).json({ error: "Input text is required!" });

    // 1. Hit Groq API from Backend
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are a task extraction engine. Extract tasks and return ONLY a valid JSON array. No markdown, no backticks.`,
            },
            {
              role: "user",
              content: `Extract tasks from: "${rawInput}". Return EXACT JSON format: [{"title": "...", "priority": "high/medium/low", "priorityScore": 1-100, "deadline": "YYYY-MM-DD or null", "scheduleTime": "HH:MM or null", "category": "work/study/personal/health", "completed": false}]`,
            },
          ],
          temperature: 0.1,
        }),
      },
    );

    if (!response.ok) throw new Error("Groq API failed");

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const extractedTasks = JSON.parse(clean);

    // 2. Save all tasks to MongoDB
    // (Agar user Auth lagaya hai toh req.user.id map kar dena, abhi basic rakh raha hu)
    const savedTasks = await Task.insertMany(extractedTasks);

    // 3. Frontend ko DB wale tasks wapas bhej do
    res.status(200).json(savedTasks);
  } catch (error) {
    console.error("Extraction Error:", error);
    res.status(500).json({ error: "Failed to extract and save tasks" });
  }
});

module.exports = router;
