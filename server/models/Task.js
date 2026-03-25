const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    priorityScore: {
      type: Number,
      min: 1,
      max: 100,
      default: 50,
    },
    deadline: {
      type: String, // YYYY-MM-DD format
      default: null,
    },
    scheduleTime: {
      type: String, // HH:MM format
      default: null,
    },
    duration: {
      type: Number, // minutes
      default: 60,
    },
    category: {
      type: String,
      enum: ["work", "study", "personal", "health"],
      default: "work",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  },
);

module.exports = mongoose.model("Task", taskSchema);
