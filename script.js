// 🚀 MAIN FUNCTION
async function sendMessage() {
  if (!userInput || !chatBox) return;

  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user-message");
  userInput.value = "";

  const loading = appendMessage("Thinking...", "bot-message");

  try {

    // ✅ MULTI-LANGUAGE INSTRUCTION (ADDED)
    const finalMessage = `
You are TradeLab Mentor.
Automatically detect the user's language.
Reply in the SAME language.
If user mixes Hindi and English, reply in Hinglish.
Explain simply like a mentor.

User message:
${text}
`;

    const response = await fetch(
      "https://late-wood-8220.aneekpal199400.workers.dev",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessage }) // ✅ ONLY CHANGE
      }
    );

    const data = await response.json();
    console.log("AI DATA 👉", data);

    loading.remove();

    if (data && data.reply) {
      appendMessage(formatResponse(data.reply), "bot-message", true);
    } else {
      appendMessage("⚠️ AI replied but no text found", "bot-message");
    }

  } catch (err) {
    console.error(err);
    loading.remove();
    appendMessage("❌ Server error. Try again.", "bot-message");
  }
}
