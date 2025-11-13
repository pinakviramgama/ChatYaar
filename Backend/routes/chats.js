import express from "express";
import { v4 as uuidv4 } from "uuid";
import Thread from "../models/Thread.js";
import getChatbotResponse from "../utils/openai.js";
const router = express.Router(); // 🟢 use Router instead of express()

// Get all threads for a user
router.get("/thread/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const threads = await Thread.find({ userId }).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to get threads" });
  }
});

// Get thread by ID
router.get("/thread/:userId/:threadId", async (req, res) => {
  const { userId, threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId, userId });
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json(thread.messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// Delete thread
router.delete("/thread/:userId/:threadId/delete", async (req, res) => {
  const { userId, threadId } = req.params;
  try {
    const deleted = await Thread.findOneAndDelete({ threadId, userId });
    if (!deleted) return res.status(404).json({ message: "Thread not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// Send chat message
router.post("/chat", async (req, res) => {
  let { threadId, message, userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  if (!threadId) threadId = uuidv4();

  try {
    let thread = await Thread.findOne({ threadId, userId });

    if (!thread) {
      thread = new Thread({
        threadId,
        userId,
        title: message.slice(0, 40),
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getChatbotResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply, threadId });
  } catch (err) {
    console.error("Chat save error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
