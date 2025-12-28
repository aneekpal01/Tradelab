// --- NAVBAR HAMBURGER MENU LOGIC ---
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

function toggleMenu() {
  if (navLinks && hamburger) {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  }
}

// --- AI CHATBOT LOGIC (SECURE VERSION) ---
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// 🔒 NO API KEY IN FRONTEND ❌
// const API_KEY = "REMOVED";

function toggleChat() {
  if (!chatContainer) return;
  chatContainer.style.display =
    chatContainer.style.display === "flex" ? "none" : "flex";
  userInput?.focus();
}

function sendQuickMsg(text) {
  if (!userInput) return;
  userInput.value = text;
  sendMessage();
}

function handleEnter(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
}

// Safe formatter (bot response only)
function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

// Safe append
function appendMessage(text, className, isHTML = false) {
  const div = document.createElement("div");
  div.className = className;
  if (isHTML) {
    div.innerHTML = text;
  } else {
    div.textContent = text;
  }
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

// 🚀 MAIN FUNCTION
async function sendMessage() {
  if (!userInput || !chatBox) return;

  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user-message");
  userInput.value = "";

  const loading = appendMessage("Thinking...", "bot-message");

  try {
    const response = await fetch(
      "https://late-wood-8220.aneekpal199400.workers.dev",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:
            "You are a professional Trading Mentor. Answer in Hinglish. Keep it short.\n\nUser: " +
            text
        })
      }
    );

    const data = await response.json();
    loading.remove();

    if (data.reply) {
      appendMessage(formatResponse(data.reply), "bot-message", true);
    } else {
      appendMessage("⚠️ No response from AI", "bot-message");
    }

  } catch (err) {
    console.error(err);
    loading.remove();
    appendMessage("❌ Server error. Try again.", "bot-message");
  }
}
