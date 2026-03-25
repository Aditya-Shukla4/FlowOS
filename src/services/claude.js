const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function extractTasks(rawInput) {
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
        messages: [
          {
            role: "system",
            content: `You are a task extraction engine. Extract tasks from user input and return ONLY a valid JSON array. No explanation, no markdown, no backticks. Just raw JSON array.`,
          },
          {
            role: "user",
            content: `Extract tasks from this input: "${rawInput}"

Return exactly this format:
[
  {
    "id": "task_1",
    "title": "Task title here",
    "priority": "high",
    "priorityScore": 85,
    "deadline": "2026-03-28",
    "scheduleTime": "09:00",
    "category": "work",
    "completed": false
  }
]

Rules:
- priority: high, medium, or low only
- category: work, study, personal, or health only
- deadline: YYYY-MM-DD format or null
- scheduleTime: HH:MM format or null
- priorityScore: number 1-100`,
          },
        ],
        temperature: 0.1,
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json();
    console.error("API Error:", err);
    throw new Error(err.error?.message || "API call failed");
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("No response from API");

  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
