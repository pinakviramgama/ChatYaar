import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chats.js";
import authRoutes from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// -------------------- MIDDLEWARE --------------------
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

    if (data?.error) {
      console.error("API Error:", data.error);
      return `API Error: ${data.error.message}`;
    }

    return data?.choices?.[0]?.message?.content || "No response from API.";
  } catch (err) {
    console.error("Fetch Error:", err);
    return "Failed to get response from API.";
  }
}

// -------------------- API ROUTES --------------------
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
  const frontendPath = path.join(__dirname, "../Fronted/dist");

  app.use(express.static(frontendPath));

  // Catch-all for SPA routes
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// -------------------- DATABASE --------------------
//DB connection successfully
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

// -------------------- START SERVER --------------------
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDB();
});
