import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30s — Groq can be slow on first call
});

export const extractTasksAPI = async (rawInput) => {
  try {
    const response = await client.post("/tasks/extract", { rawInput });
    return response.data;
  } catch (err) {
    // Axios wraps errors — pull out the useful message
    const msg =
      err.response?.data?.error || err.message || "Backend unreachable";
    throw new Error(msg);
  }
};
