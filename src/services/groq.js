const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const TODAY = new Date().toISOString().split("T")[0];

function parseJSON(text) {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {}
  // Strip markdown fences and retry
  const clean = text.replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(clean);
  } catch {}
  // Extract first JSON array from text
  const match = clean.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }
  throw new Error("Could not parse AI response as JSON");
}

export async function extractTasks(rawInput) {
  if (!GROQ_API_KEY) throw new Error("VITE_GROQ_API_KEY not set in .env");

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: `You are a task extraction engine. Today's date is ${TODAY}.
Extract all tasks from the user's input and return ONLY a raw JSON array — no markdown, no explanation, no backticks.
Each task must have:
- id: unique string like "task_<number>"
- title: clear actionable task title
- priority: "high" | "medium" | "low"
- priorityScore: number 1-100 (urgency + importance)
- deadline: YYYY-MM-DD format, or null. Resolve relative dates like "tomorrow", "Friday", "next week" based on today: ${TODAY}
- scheduleTime: HH:MM (24hr) or null
- category: "work" | "study" | "personal" | "health"
- completed: false
- duration: estimated minutes (30, 60, 90, 120)`,
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
    throw new Error(err.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Groq");

  return parseJSON(text);
}
