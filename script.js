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

  const isOpen = chatContainer.classList.contains("show");

  if (isOpen) {
    // CLOSE
    chatContainer.classList.remove("show");
    setTimeout(() => {
      chatContainer.style.display = "none";
    }, 300);
  } else {
    // OPEN
    chatContainer.style.display = "flex";
    requestAnimationFrame(() => {
      chatContainer.classList.add("show");
      userInput?.focus();
    });
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


// ===== STOP CLICK BUBBLING INSIDE AI CHAT =====
const aiChatBox = document.getElementById("aiChatBox");
const aiModeMini = document.querySelector(".ai-mode-mini");

if (aiChatBox) {
  aiChatBox.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

if (aiModeMini) {
  aiModeMini.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}


/* ===== SCROLL ANIMATION FOR CONCEPT CARDS ===== */
/* Add this to your existing script.js or inside a <script> tag */

document.addEventListener('DOMContentLoaded', () => {
  // Observe concept cards for scroll animation
  const conceptCards = document.querySelectorAll('.concept-card');
  
  const conceptObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { 
    threshold: 0.1, 
    rootMargin: '0px 0px -50px 0px' 
  });

  conceptCards.forEach(card => conceptObserver.observe(card));
});




// =============================================
// MARKET STATUS BAR — IST TIME + NSE HOURS
// =============================================

function updateMarketStatus() {
  const dot    = document.getElementById("marketDot");
  const label  = document.getElementById("marketLabel");
  const session = document.getElementById("marketSession");
  const timeEl = document.getElementById("marketTime");
  const niftyTag = document.getElementById("niftyTag");

  if (!dot || !label || !timeEl) return;

  // IST = UTC+5:30
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);

  const h = ist.getHours();
  const m = ist.getMinutes();
  const totalMins = h * 60 + m;
  const day = ist.getDay(); // 0=Sun, 6=Sat

  // Format time
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(ist.getSeconds()).padStart(2, '0');
  timeEl.textContent = `${hh}:${mm}:${ss}`;

  const isWeekend = (day === 0 || day === 6);

  // NSE: Pre-open 9:00–9:15, Market 9:15–15:30, Post 15:30–16:00
  const PRE_OPEN_START = 9 * 60;
  const MARKET_OPEN    = 9 * 60 + 15;
  const MARKET_CLOSE   = 15 * 60 + 30;
  const POST_CLOSE     = 16 * 60;

  let status = "closed";
  if (!isWeekend) {
    if (totalMins >= PRE_OPEN_START && totalMins < MARKET_OPEN) status = "pre";
    else if (totalMins >= MARKET_OPEN && totalMins < MARKET_CLOSE) status = "open";
    else if (totalMins >= MARKET_CLOSE && totalMins < POST_CLOSE) status = "post";
  }

  // Clear classes
  dot.className = "market-dot";
  label.className = "market-label";
  niftyTag.className = "market-session-tag";

  if (status === "open") {
    dot.classList.add("open");
    label.classList.add("open");
    label.textContent = "NSE OPEN";
    session.textContent = "· Live Trading";
    niftyTag.classList.add("open");
    niftyTag.textContent = "LIVE";
  } else if (status === "pre") {
    dot.classList.add("pre");
    label.classList.add("pre");
    label.textContent = "PRE-OPEN";
    session.textContent = "· 9:00–9:15 AM";
    niftyTag.classList.add("pre");
    niftyTag.textContent = "PRE";
  } else if (status === "post") {
    dot.classList.add("pre");
    label.classList.add("pre");
    label.textContent = "POST-MARKET";
    session.textContent = "· Closing session";
    niftyTag.classList.add("pre");
    niftyTag.textContent = "POST";
  } else {
    dot.classList.add("closed");
    label.classList.add("closed");
    label.textContent = isWeekend ? "MARKET CLOSED" : "NSE CLOSED";
    session.textContent = isWeekend ? "· Weekend" : "· Opens 9:15 AM";
    niftyTag.classList.add("closed");
    niftyTag.textContent = "CLOSED";
  }
}

// Run immediately + every second for live clock
updateMarketStatus();
setInterval(updateMarketStatus, 1000);


// =============================================
// PROGRESS MILESTONES — UPDATE ON PROGRESS CHANGE
// =============================================

function updateMilestones() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;

  const pct = parseFloat(bar.style.width) || 0;
  const milestones = document.querySelectorAll(".progress-milestone");

  milestones.forEach(m => {
    const mLeft = parseFloat(m.style.left);
    if (pct >= mLeft) {
      m.classList.add("reached");
    } else {
      m.classList.remove("reached");
    }
  });
}

// Hook into existing progress update — observe bar width changes
const progressBarEl = document.getElementById("progressBar");
if (progressBarEl) {
  const observer = new MutationObserver(updateMilestones);
  observer.observe(progressBarEl, { attributes: true, attributeFilter: ['style'] });
}

// Also run on load
window.addEventListener("load", updateMilestones);
