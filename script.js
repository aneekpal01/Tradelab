// --- NAVBAR HAMBURGER MENU LOGIC ---
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

function toggleMenu() {
  if (navLinks && hamburger) {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  }
}

// --- CHAT ELEMENT REFERENCES (IMPORTANT) ---
const chatContainer = document.getElementById("aiChatBox");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// --- TOGGLE AI MENTOR CHAT (OPEN / CLOSE WITH ANIMATION) ---
function toggleChat() {
  if (!chatContainer) return;

  if (chatContainer.classList.contains("show")) {
    chatContainer.classList.remove("show");
    setTimeout(() => {
      chatContainer.style.display = "none";
    }, 450);
  } else {
    chatContainer.style.display = "flex";
    setTimeout(() => {
      chatContainer.classList.add("show");
      userInput && userInput.focus();
    }, 10);
  }
}

// --- QUICK BUTTONS ---
function sendQuickMsg(text) {
  if (!userInput) return;
  userInput.value = text;
  sendMessage();
}

// --- ENTER KEY HANDLER ---
function handleEnter(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
}

// --- BOT RESPONSE FORMATTING ---
function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

// --- APPEND MESSAGE SAFELY ---
function appendMessage(text, className, isHTML = false) {
  const div = document.createElement("div");
  div.className = className;
  isHTML ? (div.innerHTML = text) : (div.textContent = text);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

// --- MAIN SEND MESSAGE FUNCTION (MULTI-LANGUAGE ENABLED) ---
async function sendMessage() {
  if (!userInput || !chatBox) return;

  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user-message");
  userInput.value = "";

  const loading = appendMessage("Thinking...", "bot-message");

  try {
    // ✅ MULTI-LANGUAGE + SAME LANGUAGE REPLY
    const finalMessage = `
You are TradeLab Mentor.

LANGUAGE RULES (STRICT):
- If the user writes in pure English → reply ONLY in English.
- If the user writes in pure Hindi → reply ONLY in Hindi.
- If the user mixes Hindi + English → reply ONLY in Hinglish.
- Do NOT mix languages unless the user mixes them first.

ANSWER RULES (VERY IMPORTANT):
- Do NOT repeat previous explanations.
- If the same topic is asked again, explain it from a DIFFERENT angle.
- Use a new example, analogy, or structure every time.
- Be concise and practical, not generic.
User message:
${text}
`;

    const response = await fetch(
      "https://late-wood-8220.aneekpal199400.workers.dev",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessage })
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



function showTyping() {
  const t = document.getElementById("typing-indicator");
  if (t) t.style.display = "block";
}

function hideTyping() {
  const t = document.getElementById("typing-indicator");
  if (t) t.style.display = "none";
}

const aiFloatBtn = document.getElementById("ai-float-btn");
if (aiFloatBtn) {
  aiFloatBtn.addEventListener("click", () => toggleChat());
}


window.addEventListener("load", () => {
  document.body.classList.remove("loading");
});

// ===== CONNECT FLOATING AI BUTTON =====
window.addEventListener("load", () => {
  const aiBtn = document.getElementById("ai-float-btn");

  if (!aiBtn) {
    console.log("❌ Floating AI button NOT found");
    return;
  }

  aiBtn.addEventListener("click", () => {
    console.log("🤖 Floating AI clicked");
    toggleChat();   // SAME function as navbar
  });
});


// ===== AI MODE SWITCH =====
function setAIMode(mode) {
  window.AI_LEVEL = mode;

  const beginnerBtn = document.getElementById("ai-beginner");
  const proBtn = document.getElementById("ai-pro");

  if (beginnerBtn && proBtn) {
    beginnerBtn.classList.toggle("active", mode === "Beginner");
    proBtn.classList.toggle("active", mode === "Pro");
  }

  console.log("AI mode set to:", mode);
}

