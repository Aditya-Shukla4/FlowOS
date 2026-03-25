require("dotenv").config(); // No path — works locally AND on Render/Railway
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/tasks", require("./routes/tasks"));

// Health check — useful for Render free tier keep-alive
app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
