import axios from "axios";

// Agar local pe chala raha hai toh localhost, warna deploy hone pe backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const extractTasksAPI = async (rawInput) => {
  const response = await axios.post(`${API_URL}/tasks/extract`, { rawInput });
  return response.data;
};
