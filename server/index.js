require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// 1. CORS Allow All (Demo ke liye zero restrictions)
app.use(cors({ origin: "*" }));
app.use(express.json());

// 2. API Routes
app.use("/api/tasks", require("./routes/tasks"));

// 3. Health Check (Render ko batane ke liye ki server zinda hai)
app.get("/health", (_, res) => res.json({ status: "ok" }));

// 4. 🔥 THE FIX: Serve React frontend correctly
app.use(express.static(path.join(__dirname, "../dist")));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// 6. Database Connection & Start
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("💀 ERROR: MONGO_URI is missing!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 MongoDB connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server zinda hai port ${PORT} pe!`));
  })
  .catch((err) => {
    console.error("💀 MongoDB connection failed:", err);
    process.exit(1);
  });
