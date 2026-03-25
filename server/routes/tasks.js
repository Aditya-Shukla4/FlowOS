const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

function parseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {}
  const clean = text.replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(clean);
  } catch {}
  const match = clean.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }
  throw new Error("Could not parse AI response as JSON");
}

router.post("/extract", async (req, res) => {
  try {
    const { rawInput } = req.body;
    if (!rawInput)
      return res.status(400).json({ error: "Input text is required" });

    const TODAY = new Date().toISOString().split("T")[0];

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
          temperature: 0.1,
          messages: [
            {
              role: "system",
              content: `You are a task extraction engine. Today's date is ${TODAY}.
Extract all tasks and return ONLY a raw JSON array. No markdown, no backticks, no explanation.
Each task must follow this schema exactly:
{
  "title": "clear actionable task title",
  "priority": "high" | "medium" | "low",
  "priorityScore": number 1-100,
  "deadline": "YYYY-MM-DD" or null,
  "scheduleTime": "HH:MM" or null,
  "category": "work" | "study" | "personal" | "health",
  "completed": false,
  "duration": 30 | 60 | 90 | 120
}
Resolve relative dates like "tomorrow", "Friday", "next week" using today: ${TODAY}.
priorityScore rules: deadline today + high priority = 90-100. deadline tomorrow + high = 75-90. medium priority this week = 50-70. low priority no deadline = 10-30. NEVER return the same score for multiple tasks.`,
            },
            {
              role: "user",
              content: `Extract tasks from: "${rawInput}"`,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Groq error ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from Groq");

    const extractedTasks = parseJSON(text);
    if (!Array.isArray(extractedTasks) || extractedTasks.length === 0)
      throw new Error("No tasks extracted");

    const savedTasks = await Task.insertMany(extractedTasks);
    res.status(200).json(savedTasks);
  } catch (error) {
    console.error("Extraction Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to extract tasks" });
  }
});

module.exports = router;
