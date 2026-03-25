require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Mongoose import karna zaruri hai!

const app = express();

// 1. Middleware (CORS sab allow kar raha hai demo ke liye)
app.use(cors({ origin: "*" }));
app.use(express.json());

// 2. Routes (Tere AI extraction wale routes)
app.use("/api/tasks", require("./routes/tasks"));

// 3. Database Connection & Ignition
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("💀 ERROR: MONGO_URI missing hai .env mein!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 MongoDB Connected Successfully!");
    // DB connect hone ke baad hi server start karenge
    app.listen(PORT, () => {
      console.log(`🚀 BACKEND ZINDA HAI! Server running on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("💀 MongoDB Connection Error:", err);
  });
