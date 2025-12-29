// --- NAVBAR HAMBURGER MENU LOGIC ---
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

function toggleMenu() {
  if (navLinks && hamburger) {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  }
}

// --- AI CHATBOT LOGIC ---
const chatContainer = document.querySelector(".chat-container"); // ✅ FIX
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

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
      userInput?.focus();
    }, 10);
  }
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

// Bot formatting only
function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

// Append message safely
function appendMessage(text, className, isHTML = false) {
  const div = document.createElement("div");
  div.className = className;
  isHTML ? (div.innerHTML = text) : (div.textContent = text);
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
        body: JSON.stringify({ message: text }) // ✅ ONLY USER MESSAGE
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
