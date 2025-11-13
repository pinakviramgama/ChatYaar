import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import fetch from "node-fetch";
import chatRoutes from "./routes/chats.js";
import authRoutes from "./routes/user.js";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
  console.log(`server running on port no ${PORT}`);
  connectDB();
});

async function getChatbotResponse(message) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }],
        }),
      }
    );

    const data = await response.json();
    console.log(data.choices);

    if (data.error) {
      console.error("API Error:", data.error);
      return `API Error: ${data.error.message}`;
    }

    if (!data.choices || data.choices.length === 0) {
      console.error("Unexpected API response:", data);
      return "No response from API.";
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error("Fetch Error:", err);
    return "Failed to get response from API.";
  }
}

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const reply = await getChatbotResponse(message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Failed to get chatbot response" });
  }
});

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
    console.log("Failed to connect with DB");
  }
};
