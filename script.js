// --- CHAT ELEMENT REFERENCES (IMPORTANT) ---
const chatContainer = document.getElementById("aiChatBox");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// --- LOCAL SEARCH / FAQ DEFINITIONS (OFFLINE BEST FEATURE) ---
const localTradingFAQ = {
  "bos": "**BOS (Break of Structure)** happens when the market is in a trend (uptrend or downtrend) and the price breaks and closes past the previous swing high or low. This confirms the trend is continuing.\\n\\nKey points:\\n• In an uptrend, breaking the previous higher high is a bullish BOS.\\n• In a downtrend, breaking the previous lower low is a bearish BOS.\\n• Always wait for a candle body close past the level, not just a wick sweep.",
  "choch": "**CHoCH (Change of Character)** is the first sign of a potential trend change. It occurs when price breaks structural points in the opposite direction of the current trend.\\n\\nKey points:\\n• In an uptrend, a break below the last Higher Low is a bearish CHoCH.\\n• In a downtrend, a break above the last Lower High is a bullish CHoCH.\\n• It signals that order flow is shifting from buyers to sellers (or vice versa).",
  "trendline": "A **Trendline** is a diagonal boundary drawn to track structural direction.\\n\\nHow to draw:\\n1. Connect at least 2 key swing highs (in a downtrend) or swing lows (in an uptrend).\\n2. Do not force lines to fit - if it cuts through candle bodies, it's invalid.\\n3. The more times price touches a trendline without breaking, the stronger it becomes.",
  "rsi": "**RSI (Relative Strength Index)** is a popular momentum indicator:\\n• **Overbought (>70):** Indicates buying momentum is stretched, potential reversal or pullback.\\n• **Oversold (<30):** Indicates selling momentum is stretched, potential bounce.\\n• **Divergence:** If price makes a higher high but RSI makes a lower high, it signals weakening momentum and a highly probable reversal setup.",
  "ema": "**EMA (Exponential Moving Average)** reacts faster to recent price fluctuations than Simple Moving Averages (SMA). It is commonly used to identify dynamic support/resistance levels and track current trend momentum (e.g., 20 EMA, 50 EMA, 200 EMA).",
  "liquidity": "**Liquidity** represents zones where clusters of stop losses reside (commonly just above swing highs or below swing lows). Institutions target these areas to build their large positions without slippage before driving the price in the intended direction.",
  "risk": "**Risk Management** is the single most important rule in trading:\\n1. Never risk more than **1% to 2%** of your total account balance per trade.\\n2. Set your Stop Loss first, then calculate your position/lot size accordingly.\\n3. Always target a minimum of **1:2 Risk-to-Reward Ratio** (meaning you stand to make twice what you risk).",
  "candlestick": "**Candlesticks** display the Open, High, Low, and Close prices for a specific time period:\\n• **Body:** Shows the range between the Open and Close.\\n• **Wicks:** Show price rejection at the highs and lows.\\n• Key patterns to look for include **Pinbars / Hammers** (rejection at lows) and **Engulfing candles** (strong momentum shift).",
  "r:r": "**R:R (Risk-to-Reward Ratio)** compares the potential loss of a trade to its potential profit. A 1:2 R:R means you risk ₹1,000 to make ₹2,000. Under this structure, even a 40% win rate keeps you profitable over time."
};

let chatInitialized = false;
let placeholderInterval = null;

// --- INPUT PLACEHOLDER ROTATION ---
function startPlaceholderRotation() {
  if (!userInput) return;
  const placeholders = [
    "Ask anything...",
    "• How to draw trendline?",
    "• Risk management",
    "• Psychology"
  ];
  let idx = 0;
  clearInterval(placeholderInterval);
  placeholderInterval = setInterval(() => {
    idx = (idx + 1) % placeholders.length;
    userInput.placeholder = placeholders[idx];
  }, 3000);
}

// --- DYNAMIC WELCOME MESSAGE & COURSE ASSISTANT HELPER CARD ---
function initChatWelcome() {
  if (!chatBox) return;
  
  // 1. Welcome Card (Transparent glass card, not a floating chat bubble)
  const welcomeCard = document.getElementById("chatWelcome");
  if (welcomeCard) {
    welcomeCard.innerHTML = `
      <div class="chat-welcome-card">
        <strong>👋 Welcome back!</strong><br>
        <span style="font-size: 13px; color: var(--text-secondary);">Choose a topic below or ask anything.</span>
      </div>
    `;
  }
  
  // 2. Learning Streak & Daily Tip Card (fills the gap)
  insertDailyStreakOrTip();
  
  // 3. Course Assistant Helper Card
  insertCourseAssistantCard();
  
  // 4. Reset chip highlights
  highlightActiveChip(null);
  
  chatInitialized = true;
  startPlaceholderRotation();
}

function insertDailyStreakOrTip() {
  const container = document.getElementById("chatStreak");
  if (!container) return;
  
  const completedVideos = JSON.parse(localStorage.getItem('completedVideos')) || [];
  let streak = localStorage.getItem('tradelab_streak') || 1;
  const lastVisit = localStorage.getItem('tradelab_last_visit');
  const today = new Date().toDateString();
  
  if (lastVisit && lastVisit !== today) {
    streak = parseInt(streak) + 1;
    localStorage.setItem('tradelab_streak', streak);
  }
  localStorage.setItem('tradelab_last_visit', today);
  
  const tips = [
    "Always plan your exit (stop loss & target) before placing a trade.",
    "Cut your losses quickly. Let your winners run.",
    "Risk only 1% to 2% of your capital per trade.",
    "A high win rate is useless without good risk-to-reward ratio.",
    "Keep a trading journal to review your mistakes.",
    "Wait for candle body closes to confirm breakouts, wicks can lie!"
  ];
  const tip = tips[new Date().getDate() % tips.length];
  
  container.innerHTML = `
    <div class="chat-streak-card" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 14px; margin-top: 12px; text-align: left;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <span style="font-size: 12.5px; font-weight: 700; color: #ff9f43; display: flex; align-items: center; gap: 4px;">🔥 ${streak}-Day Learning Streak</span>
        <span style="font-size: 11px; color: #8892b0; font-weight: 500;">Goal: 1 Lesson</span>
      </div>
      <div style="font-size: 12px; color: #8892b0; line-height: 1.4;">💡 <strong>Daily Tip:</strong> ${tip}</div>
    </div>
  `;
}

function insertCourseAssistantCard() {
  const completedVideos = JSON.parse(localStorage.getItem('completedVideos')) || [];
  const cards = document.querySelectorAll('.learning-grid .learning-card');
  const cardContainer = document.getElementById("chatCourseCard");
  if (!cardContainer || cards.length === 0) return;
  
  let currentLessonTitle = "Trading Basics";
  let nextIndex = 1;
  let nextCard = null;
  
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const btn = card.querySelector('.complete-btn');
    if (btn) {
      const onclickAttr = btn.getAttribute('onclick') || '';
      const match = onclickAttr.match(/'([^']+)'/);
      if (match && match[1]) {
        const videoId = match[1];
        if (!completedVideos.includes(videoId)) {
          currentLessonTitle = card.querySelector('h3').textContent.trim();
          nextIndex = i + 1;
          nextCard = card;
          break;
        }
      }
    }
  }
  
  const scrollId = nextCard ? nextCard.id : 'lesson-1';
  let quickActionsHTML = "";
  const lTitle = currentLessonTitle.toLowerCase();
  
  if (lTitle.includes('structure') || lTitle.includes('bos') || lTitle.includes('trend')) {
    quickActionsHTML = `
      <button class="chat-helper-action-btn" onclick="sendQuickMsg('What is BOS?')">📊 Explain BOS</button>
      <button class="chat-helper-action-btn" onclick="sendQuickMsg('What is CHoCH?')">🔄 Explain CHoCH</button>
    `;
  } else if (lTitle.includes('candle') || lTitle.includes('pattern') || lTitle.includes('basics')) {
    quickActionsHTML = `
      <button class="chat-helper-action-btn" onclick="sendQuickMsg('Explain Candlesticks')">🕯️ Explain Candlesticks</button>
      <button class="chat-helper-action-btn" onclick="sendQuickMsg('How to draw trendlines?')">📈 Trendlines</button>
    `;
  } else {
    quickActionsHTML = `
      <button class="chat-helper-action-btn" onclick="sendQuickMsg('How much risk per trade?')">🛡️ Risk Rules</button>
      <button class="chat-helper-action-btn" onclick="sendQuickMsg('Explain R:R')">📊 Explain R:R</button>
    `;
  }
  
  cardContainer.innerHTML = `
    <div class="course-helper-card" style="background: rgba(0, 212, 255, 0.04); border: 1px solid rgba(0, 212, 255, 0.15); border-radius: 12px; padding: 14px; margin-top: 12px; text-align: left;">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #00d4ff; letter-spacing: 0.5px; margin-bottom: 5px;">📘 Course Assistant</div>
      <div style="font-size: 13.5px; font-weight: 600; color: #ffffff; margin-bottom: 3px;">You're currently learning:<br><span style="color:#00ff9c;">${currentLessonTitle}</span></div>
      <div style="font-size: 11.5px; color: #8892b0; margin-bottom: 10px;">Lesson ${nextIndex} / ${cards.length}</div>
      
      <div class="chat-helper-actions" style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${quickActionsHTML}
        <button class="chat-helper-action-btn" onclick="scrollToLesson('${scrollId}'); toggleChat();">🎯 Scroll</button>
        <button class="chat-helper-action-btn" onclick="window.location.href='quiz.html'">✍️ Quiz</button>
      </div>
    </div>
  `;
}

// --- HIGHLIGHT ACTIVE CHIP ---
function highlightActiveChip(key) {
  const container = document.getElementById("chatChips");
  if (!container) return;
  
  const buttons = container.querySelectorAll(".chat-helper-action-btn");
  buttons.forEach(btn => {
    const text = btn.textContent.toLowerCase();
    if (key && text.includes(key.toLowerCase())) {
      btn.classList.add("active");
      btn.classList.remove("inactive");
    } else if (key) {
      btn.classList.add("inactive");
      btn.classList.remove("active");
    } else {
      btn.classList.remove("active");
      btn.classList.remove("inactive");
    }
  });
}

// --- TOGGLE CHAT (OPEN / CLOSE WITH ANIMATION) ---
function toggleChat() {
  if (!chatContainer) return;

  const isOpen = chatContainer.classList.contains("show");

  if (isOpen) {
    chatContainer.classList.remove("show");
    setTimeout(() => {
      chatContainer.style.display = "none";
    }, 300);
  } else {
    chatContainer.style.display = "flex";
    requestAnimationFrame(() => {
      chatContainer.classList.add("show");
      userInput?.focus();
      initChatWelcome();
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
    .replace(/\n/g, "<br>")
    .replace(/• (.*?)(<br>|$)/g, "• $1$2");
}

// --- APPEND MESSAGE SAFELY (TO HISTORY ELEMENT) ---
function appendMessage(text, className, isHTML = false) {
  const history = document.getElementById("chatHistory");
  if (!history) return;
  
  const div = document.createElement("div");
  div.className = className;
  isHTML ? (div.innerHTML = text) : (div.textContent = text);
  history.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

// --- MAIN SEND MESSAGE FUNCTION (LOCAL SEARCH ONLY) ---
async function sendMessage() {
  if (!userInput || !chatBox) return;

  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user-message");
  userInput.value = "";

  // Show dynamic typing indicator (smooth 1-second delay)
  const indicator = document.getElementById("typing-indicator");
  if (indicator) {
    chatBox.appendChild(indicator);
    indicator.style.display = "block";
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // 1. Search knowledge base locally
  const query = text.toLowerCase();
  let matchedKey = null;
  
  if (query.includes("bos") || query.includes("break of structure")) matchedKey = "bos";
  else if (query.includes("choch") || query.includes("change of character")) matchedKey = "choch";
  else if (query.includes("trendline") || query.includes("trend line") || query.includes("draw trendline")) matchedKey = "trendline";
  else if (query.includes("rsi") || query.includes("relative strength")) matchedKey = "rsi";
  else if (query.includes("ema") || query.includes("moving average")) matchedKey = "ema";
  else if (query.includes("liquidity") || query.includes("sweep")) matchedKey = "liquidity";
  else if (query.includes("risk") || query.includes("money management") || query.includes("position size") || query.includes("risk per trade")) matchedKey = "risk";
  else if (query.includes("candlestick") || query.includes("candle") || query.includes("wick")) matchedKey = "candlestick";
  else if (query.includes("r:r") || query.includes("risk-reward") || query.includes("risk to reward")) matchedKey = "r:r";
  else if (query.includes("psychology") || query.includes("emotion") || query.includes("control")) matchedKey = "psychology";

  // Match chip highlights
  highlightActiveChip(matchedKey);

  setTimeout(() => {
    if (indicator) indicator.style.display = "none";
    
    if (matchedKey) {
      // Map psychology query to risk advice or key definition
      const lookupKey = matchedKey === "psychology" ? "risk" : matchedKey;
      const reply = localTradingFAQ[lookupKey];
      appendMessage(formatResponse(reply), "bot-message", true);
    } else {
      appendMessage("This topic isn't available yet. Try asking about **BOS**, **CHoCH**, **Trendlines**, **Risk**, or **RSI**.", "bot-message", true);
    }
  }, 1000);
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
  startPlaceholderRotation();
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
    threshold: 0.1 
  });

  conceptCards.forEach(card => conceptObserver.observe(card));
});

// MARKET STATUS BAR — IST TIME + NSE HOURS + terminal info
// =============================================
let lastUpdateSeconds = 0;
let lastNseStatus = null;
let nseTransitioning = false;

function openAlertsDrawer() {
  const panel = document.getElementById("alertsPanel");
  if (panel) panel.classList.add("show");
}

function closeAlertsDrawer() {
  const panel = document.getElementById("alertsPanel");
  if (panel) panel.classList.remove("show");
}

function toggleClockDropdown(e) {
  e.stopPropagation();
  const dropdown = document.getElementById("clockDropdown");
  if (dropdown) dropdown.classList.toggle("show");
}

function changeClockFormat(e, format) {
  e.stopPropagation();
  localStorage.setItem('clockFormat', format);
  
  const dropdown = document.getElementById("clockDropdown");
  if (dropdown) dropdown.classList.remove("show");
  
  const c24 = document.getElementById("check24");
  const c12 = document.getElementById("check12");
  if (c24 && c12) {
    c24.textContent = format === '24h' ? '✓' : '';
    c12.textContent = format === '12h' ? '✓' : '';
  }
  
  updateMarketStatus();
}

// Close clock dropdown on window clicks
document.addEventListener('click', () => {
  const dropdown = document.getElementById("clockDropdown");
  if (dropdown) dropdown.classList.remove("show");
});

// Initialize format checkmarks on window load
window.addEventListener('load', () => {
  const format = localStorage.getItem('clockFormat') || '24h';
  const c24 = document.getElementById("check24");
  const c12 = document.getElementById("check12");
  if (c24 && c12) {
    c24.textContent = format === '24h' ? '✓' : '';
    c12.textContent = format === '12h' ? '✓' : '';
  }
});

function updateMarketStatus() {
  const dot      = document.getElementById("marketDot");
  const label    = document.getElementById("marketLabel");
  const session  = document.getElementById("marketSession");
  const timeEl   = document.getElementById("marketTime");

  if (!dot || !label || !timeEl) return;

  // IST = UTC+5:30
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);

  const h = ist.getHours();
  const m = ist.getMinutes();
  const totalMins = h * 60 + m;
  const day = ist.getDay(); // 0=Sun, 6=Sat

  // Format clock time based on user format preference
  const format = localStorage.getItem('clockFormat') || '24h';
  let timeStr = "";
  const col = '<span class="clock-colon-blink">:</span>';
  
  const mm = String(m).padStart(2, '0');
  const ss = String(ist.getSeconds()).padStart(2, '0');

  if (format === '12h') {
    const ampm = h >= 12 ? 'PM' : 'AM';
    let displayH = h % 12;
    displayH = displayH ? displayH : 12; // 0 becomes 12
    const hh = String(displayH).padStart(2, '0');
    timeStr = `${hh}${col}${mm}${col}${ss} ${ampm}`;
  } else {
    const hh = String(h).padStart(2, '0');
    timeStr = `${hh}${col}${mm}${col}${ss}`;
  }
  
  timeEl.innerHTML = timeStr;

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

  // Handle state-transition animation (Closed -> Opening... -> LIVE)
  if (lastNseStatus === "closed" && nseStatus === "open" && !nseTransitioning) {
    nseTransitioning = true;
    setTimeout(() => {
      nseTransitioning = false;
      updateMarketStatus();
    }, 300);
  }
  
  // Save current state for next tick comparison
  if (!nseTransitioning) {
    lastNseStatus = nseStatus;
  }

  // Calculate live countdown text
  let countdownText = "";
  
  if (isWeekend) {
    // Weekend countdown
    let hrsLeft = (24 - h) + 9; // Hours till Mon 9:00 AM
    let daysLeft = 0;
    if (day === 6) { // Sat
      hrsLeft += 24; // Add Sun
      daysLeft = 1;
      const displayHours = hrsLeft - 24;
      countdownText = `Opens Monday in ${daysLeft}d ${displayHours}h`;
    } else { // Sun
      countdownText = `Opens Monday in ${hrsLeft}h`;
    }
  } else {
    if (totalMins < PRE_OPEN_START) {
      const diffMins = PRE_OPEN_START - totalMins;
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      countdownText = `Opens in ${hrs}h ${mins}m`;
    } else if (totalMins >= PRE_OPEN_START && totalMins < MARKET_OPEN) {
      const diffMins = MARKET_OPEN - totalMins;
      const secLeft = 60 - ist.getSeconds();
      const secStr = String(secLeft).padStart(2, '0');
      const minStr = String(diffMins - 1).padStart(2, '0');
      countdownText = `Trading starts in ${minStr}m ${secStr}s`;
    } else if (totalMins >= MARKET_OPEN && totalMins < MARKET_CLOSE) {
      const diffMins = MARKET_CLOSE - totalMins;
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      const hrStr = String(hrs).padStart(2, '0');
      const minStr = String(mins).padStart(2, '0');
      countdownText = `Closes in ${hrStr}h ${minStr}m`;
    } else {
      let diffMins = (24 * 60 - totalMins) + PRE_OPEN_START;
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      const hrStr = String(hrs).padStart(2, '0');
      const minStr = String(mins).padStart(2, '0');
      countdownText = `Opens in ${hrStr}h ${minStr}m`;
    }
  }

  // Update classes and text based on transition and active statuses
  dot.className = "status-indicator-dot";
  label.className = "status-main-label";

  if (nseTransitioning) {
    dot.classList.add("pre");
    label.classList.add("pre");
    label.textContent = "🟡 NSE OPENING...";
    session.textContent = "Readying order books";
    label.setAttribute('data-countdown', "Opening...");
  } else if (nseStatus === "open") {
    dot.classList.add("open");
    label.classList.add("open");
    label.textContent = "🟢 NSE LIVE";
    session.textContent = `Closes in ${countdownText.replace("Closes in ", "")}`;
    label.setAttribute('data-countdown', countdownText.replace("Closes in ", ""));
    
    const nseDot = document.getElementById("nseDot");
    if (nseDot) nseDot.className = "weather-dot green-dot";
  } else if (nseStatus === "pre") {
    dot.classList.add("pre");
    label.classList.add("pre");
    label.textContent = "🟡 PRE-OPEN";
    session.textContent = countdownText;
    label.setAttribute('data-countdown', countdownText.replace("Trading starts in ", ""));
    
    const nseDot = document.getElementById("nseDot");
    if (nseDot) nseDot.className = "weather-dot yellow-dot";
  } else if (isWeekend) {
    dot.classList.add("weekend");
    label.classList.add("weekend");
    label.textContent = "⚪ WEEKEND";
    session.textContent = countdownText;
    label.setAttribute('data-countdown', countdownText.replace("Opens Monday in ", ""));
    
    const nseDot = document.getElementById("nseDot");
    if (nseDot) nseDot.className = "weather-dot white-dot";
  } else {
    dot.classList.add("closed");
    label.classList.add("closed");
    label.textContent = "🔴 NSE CLOSED";
    session.textContent = countdownText;
    label.setAttribute('data-countdown', countdownText.replace("Opens in ", ""));
    
    const nseDot = document.getElementById("nseDot");
    if (nseDot) nseDot.className = "weather-dot red-dot";
  }

  // ── London Forex Session (Mon-Fri 1:30 PM - 10:30 PM IST) ──
  const londonStart = 13 * 60 + 30;
  const londonEnd = 22 * 60 + 30;
  let londonStatus = "closed";
  if (!isWeekend) {
    if (totalMins >= (londonStart - 30) && totalMins < londonStart) londonStatus = "pre";
    else if (totalMins >= londonStart && totalMins < londonEnd) londonStatus = "open";
  }
  const londonDot = document.getElementById("londonDot");
  if (londonDot) {
    if (londonStatus === "open") londonDot.className = "weather-dot green-dot";
    else if (londonStatus === "pre") londonDot.className = "weather-dot yellow-dot";
    else if (isWeekend) londonDot.className = "weather-dot white-dot";
    else londonDot.className = "weather-dot red-dot";
  }

  // ── New York Forex Session (Mon-Fri 6:30 PM - 1:30 AM IST) ──
  let nyStatus = "closed";
  if (!isWeekend) {
    if (totalMins >= 18*60 && totalMins < 18*60+30) nyStatus = "pre";
    else if (totalMins >= 18*60+30 || totalMins < 1*60+30) nyStatus = "open";
  }
  const nyDot = document.getElementById("nyDot");
  if (nyDot) {
    if (nyStatus === "open") nyDot.className = "weather-dot green-dot";
    else if (nyStatus === "pre") nyDot.className = "weather-dot yellow-dot";
    else if (isWeekend) nyDot.className = "weather-dot white-dot";
    else nyDot.className = "weather-dot red-dot";
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
  const profileStreak = document.getElementById("profileStreak");

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
  if (badge && countEl) {
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

  if (profileStreak) {
    profileStreak.textContent = `🔥 Day ${streak}`;
    if (streak >= 7) profileStreak.classList.add("hot");
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
