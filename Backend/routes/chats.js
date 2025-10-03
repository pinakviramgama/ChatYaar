import express from "express";
import { v4 as uuidv4 } from "uuid";
import Thread from "../models/Thread.js";
import getChatbotResponse from "../utils/openai.js";
const router = express();

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

router.post("/chat", async (req, res) => {
  let { threadId, message } = req.body;

  // If threadId not provided, create one (for new chat from frontend)
  if (!threadId) {
    threadId = uuidv4();
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      console.log("triggered");

      thread = new Thread({
        threadId,
        title: message, // or customize for better titles
        messages: [{ role: "user", content: message }],
        updatedAt: new Date(),
      });
    } else {
      console.log("not");

      thread.messages.push({ role: "user", content: message });
      thread.updatedAt = new Date();
    }

    const assistantReply = await getChatbotResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistantReply, threadId: thread.threadId }); // Echo back threadId for frontend state
  } catch (err) {
    console.error("Failed chat save:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
