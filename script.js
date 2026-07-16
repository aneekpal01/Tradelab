// --- AI CHAT ELEMENT REFERENCES (IMPORTANT) ---
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
  const dot      = document.getElementById("marketDot");
  const label    = document.getElementById("marketLabel");
  const session  = document.getElementById("marketSession");
  const timeEl   = document.getElementById("marketTime");
  const niftyTag = document.getElementById("niftyTag");
  const forexTag = document.getElementById("forexTag");
  const cryptoTag = document.getElementById("cryptoTag");

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

  // ── NSE Hours (IST) ──
  const PRE_OPEN_START = 9 * 60;
  const MARKET_OPEN    = 9 * 60 + 15;
  const MARKET_CLOSE   = 15 * 60 + 30;
  const POST_CLOSE     = 16 * 60;

  let nseStatus = "closed";
  if (!isWeekend) {
    if (totalMins >= PRE_OPEN_START && totalMins < MARKET_OPEN) nseStatus = "pre";
    else if (totalMins >= MARKET_OPEN && totalMins < MARKET_CLOSE) nseStatus = "open";
    else if (totalMins >= MARKET_CLOSE && totalMins < POST_CLOSE) nseStatus = "post";
  }

  // ── Forex Hours (IST) ──
  // Forex: Mon 6:30 AM IST → Sat 4:30 AM IST (24/5)
  // Closed: Sat 4:30 AM → Mon 6:30 AM IST
  // Sessions in IST:
  //   Sydney:  5:30 AM – 2:30 PM
  //   Tokyo:   6:30 AM – 3:30 PM
  //   London:  1:30 PM – 10:30 PM  ← best liquidity
  //   NY:      6:30 PM – 1:30 AM
  let forexStatus = "closed";
  let forexSession = "";
  if (!(day === 6 && totalMins >= 4*60+30) && !(day === 0) && !(day === 1 && totalMins < 6*60+30)) {
    forexStatus = "open";
    // Show current active session
    if (totalMins >= 5*60+30 && totalMins < 6*60+30)       forexSession = "Sydney";
    else if (totalMins >= 6*60+30 && totalMins < 13*60+30)  forexSession = "Tokyo";
    else if (totalMins >= 13*60+30 && totalMins < 18*60+30) forexSession = "London ⚡";
    else if (totalMins >= 18*60+30 && totalMins < 22*60)    forexSession = "NY+London";
    else if (totalMins >= 22*60 || totalMins < 1*60+30)     forexSession = "New York";
    else forexSession = "Open";
  }

  // ── NSE tag update ──
  dot.className = "market-dot";
  label.className = "market-label";
  niftyTag.className = "market-session-tag";

  if (nseStatus === "open") {
    dot.classList.add("open");
    label.classList.add("open");
    label.textContent = "NSE OPEN";
    session.textContent = "· Live Trading";
    niftyTag.classList.add("open");
    niftyTag.textContent = "LIVE";
  } else if (nseStatus === "pre") {
    dot.classList.add("pre");
    label.classList.add("pre");
    label.textContent = "PRE-OPEN";
    session.textContent = "· 9:00–9:15 AM";
    niftyTag.classList.add("pre");
    niftyTag.textContent = "PRE";
  } else if (nseStatus === "post") {
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

  // ── Crypto tag (always 24/7) ──
  if (cryptoTag) {
    cryptoTag.className = "market-session-tag open";
    cryptoTag.textContent = "24/7";
  }

  // ── Forex tag update ──
  if (forexTag) {
    forexTag.className = "market-session-tag";
    if (forexStatus === "open") {
      forexTag.classList.add("open");
      forexTag.textContent = forexSession || "OPEN";
    } else {
      forexTag.classList.add("closed");
      forexTag.textContent = "CLOSED";
    }
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


// =============================================
// STREAK / XP SYSTEM
// =============================================

function initStreak() {
  const badge  = document.getElementById("streakBadge");
  const countEl = document.getElementById("streakCount");
  if (!badge || !countEl) return;

  const today     = new Date().toDateString();
  const lastVisit = localStorage.getItem("tl_last_visit");
  let streak      = parseInt(localStorage.getItem("tl_streak") || "0");

  if (lastVisit === today) {
    // Same day — streak unchanged
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastVisit === yesterday.toDateString()) {
      // Consecutive day — increment
      streak += 1;
    } else if (!lastVisit) {
      // First ever visit
      streak = 1;
    } else {
      // Streak broken
      streak = 1;
    }
    localStorage.setItem("tl_last_visit", today);
    localStorage.setItem("tl_streak", streak);
  }

  // Show badge only if streak >= 1
  if (streak >= 1) {
    countEl.textContent = `Day ${streak}`;
    badge.classList.remove("hidden");
    // Hot glow if 7+ day streak
    if (streak >= 7) badge.classList.add("hot");
    else badge.classList.remove("hot");
  } else {
    badge.classList.add("hidden");
  }
}

initStreak();


// =============================================
// MOBILE TAB BAR — ACTIVE STATE ON SCROLL
// =============================================

(function() {
  const tabLearn = document.getElementById("tabLearn");
  if (!tabLearn) return;

  const learnSection = document.getElementById("learn");
  if (!learnSection) return;

  window.addEventListener("scroll", () => {
    const rect = learnSection.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom > 0) {
      tabLearn.classList.add("active");
    } else {
      tabLearn.classList.remove("active");
    }
  }, { passive: true });
})();



// =============================================
// STATS — LOGIN COUNT + COMPLETED + TOTAL VIDEOS
// =============================================

function initStats() {
  // 1. LOGIN COUNT — increment each session
  let loginCount = parseInt(localStorage.getItem("tl_login_count") || "0");
  const lastSession = localStorage.getItem("tl_last_session");
  const nowSession  = Date.now().toString();

  // Count each new page load as a visit (throttled: once per 5 mins)
  if (!lastSession || (Date.now() - parseInt(lastSession)) > 5 * 60 * 1000) {
    loginCount += 1;
    localStorage.setItem("tl_login_count", loginCount);
    localStorage.setItem("tl_last_session", nowSession);
  }

  // 2. COMPLETED LECTURES
  const completed = (JSON.parse(localStorage.getItem("completedVideos") || "[]")).length;

  // 3. TOTAL VIDEOS — count from DOM
  const totalVideos = document.querySelectorAll('.complete-btn').length || 25;

  // 4. UPDATE STATS STRIP
  const statLearning = document.getElementById("statLearning");
  const statVideos   = document.getElementById("statVideos");

  if (statLearning) {
    // "Already Learning" = base 1523 + login count
    animateCount(statLearning, 1523 + loginCount, false);
  }

  if (statVideos) {
    animateCount(statVideos, totalVideos, false);
  }
}

function animateCount(el, target, isPercent) {
  const duration = 1200;
  const start = performance.now();
  const from = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (target - from) * eased);
    el.textContent = isPercent ? current + "%" : current.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStats);
} else {
  initStats();
}
