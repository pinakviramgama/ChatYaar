import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chats.js";
import authRoutes from "./routes/user.js";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// -------------------- CHAT FUNCTION --------------------
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
      },
    );

    const data = await response.json();

    if (data.error) {
      return `API Error: ${data.error.message}`;
    }

    if (!data.choices || data.choices.length === 0) {
      return "No response from API.";
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error("Fetch Error:", err);
    return "Failed to get response from API.";
  }
}

// -------------------- ROUTES --------------------
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const reply = await getChatbotResponse(message);
  res.json({ reply });
});

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

// -------------------- SERVE FRONTEND --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// -------------------- DB CONNECTION --------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Failed to connect with DB", err);
  }
};

// -------------------- START SERVER --------------------
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
