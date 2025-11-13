import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const threadSchema = new mongoose.Schema({
  threadId: { type: String, required: true, unique: true },
  userId: { type: String, required: true }, // 🟢 new line
  title: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Thread", threadSchema);
