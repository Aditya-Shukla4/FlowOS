require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/tasks", require("./routes/tasks"));

app.get("/health", (_, res) => res.json({ status: "ok" }));

// Serve React frontend
app.use(express.static(path.join(__dirname, "../dist")));
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

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
