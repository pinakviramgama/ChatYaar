import "dotenv/config";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function getChatbotResponse(message) {
  try {
    if (message == "" || message == null) return;
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

export default getChatbotResponse;
