import express from "express";
import Thread from "../models/Thread.js";
import getChatbotResponse from "../utils/openai.js";
const router = express();

//Testing route for chat
router.post("/test", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const reply = await getChatbotResponse(message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Failed to get chatbot response" });
  }
});

//get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err.message);
  }
});

//get thread by it's ID
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread/Chat not found...!" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.log(err.message);
  }
});

//delete thread by it's ID
router.delete("/thread/delete", async (req, res) => {
  const { threadId } = req.body;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ message: "Thread Not Found" });
    }

    res.status(200).json({ success: "Thread Deleted Successfully" });
  } catch (err) {}
});

// store chats when user is chating
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "message not found" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getChatbotResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

export default router;
