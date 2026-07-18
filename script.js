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

let isTogglingChat = false;

// --- TOGGLE CHAT (OPEN / CLOSE WITH ANIMATION) ---
function toggleChat() {
  if (!chatContainer || isTogglingChat) return;

  isTogglingChat = true;
  const isOpen = chatContainer.classList.contains("show");
  const floatBtn = document.getElementById("ai-float-btn");

  if (isOpen) {
    chatContainer.classList.remove("show");
    if (floatBtn) {
      floatBtn.classList.remove("active");
      floatBtn.innerHTML = "💬";
    }
    setTimeout(() => {
      chatContainer.style.display = "none";
      isTogglingChat = false;
    }, 300);
  } else {
    chatContainer.style.display = "flex";
    requestAnimationFrame(() => {
      chatContainer.classList.add("show");
      userInput?.focus();
      initChatWelcome();
      setTimeout(() => {
        isTogglingChat = false;
      }, 300);
    });
    if (floatBtn) {
      floatBtn.classList.add("active");
      floatBtn.innerHTML = "✕";
    }
  }
}

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




window.addEventListener("load", () => {
  document.body.classList.remove("loading");
  startPlaceholderRotation();
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
  if (panel) {
    panel.classList.add("show");
    renderNotifications();
    fetchLiveNews();
  }
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

// Close dropdowns on window clicks
document.addEventListener('click', () => {
  const dropdown = document.getElementById("clockDropdown");
  if (dropdown) dropdown.classList.remove("show");
  
  const progDropdown = document.getElementById("progressMenuDropdown");
  if (progDropdown) progDropdown.classList.remove("show");
});

function toggleProgressMenu(e) {
  e.stopPropagation();
  const dropdown = document.getElementById("progressMenuDropdown");
  if (dropdown) dropdown.classList.toggle("show");
}

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
    
    const nseText = document.getElementById("nseStatusText");
    const nseItem = document.getElementById("nseSessionItem");
    if (nseText) {
      nseText.innerHTML = "🟢 NSE";
      nseText.classList.add("active");
    }
    if (nseItem) nseItem.classList.add("active");
  } else if (nseStatus === "pre") {
    dot.classList.add("pre");
    label.classList.add("pre");
    label.textContent = "🟡 PRE-OPEN";
    session.textContent = countdownText;
    label.setAttribute('data-countdown', countdownText.replace("Trading starts in ", ""));
    
    const nseText = document.getElementById("nseStatusText");
    const nseItem = document.getElementById("nseSessionItem");
    if (nseText) {
      nseText.innerHTML = "🟡 NSE";
      nseText.classList.add("active");
    }
    if (nseItem) nseItem.classList.add("active");
  } else if (isWeekend) {
    dot.classList.add("weekend");
    label.classList.add("weekend");
    label.textContent = "⚪ WEEKEND";
    session.textContent = countdownText;
    label.setAttribute('data-countdown', countdownText.replace("Opens Monday in ", ""));
    
    const nseText = document.getElementById("nseStatusText");
    const nseItem = document.getElementById("nseSessionItem");
    if (nseText) {
      nseText.innerHTML = "NSE";
      nseText.classList.remove("active");
    }
    if (nseItem) nseItem.classList.remove("active");
  } else {
    dot.classList.add("closed");
    label.classList.add("closed");
    label.textContent = "🔴 NSE CLOSED";
    session.textContent = countdownText;
    label.setAttribute('data-countdown', countdownText.replace("Opens in ", ""));
    
    const nseText = document.getElementById("nseStatusText");
    const nseItem = document.getElementById("nseSessionItem");
    if (nseText) {
      nseText.innerHTML = "NSE";
      nseText.classList.remove("active");
    }
    if (nseItem) nseItem.classList.remove("active");
  }

  // ── London Forex Session (Mon-Fri 1:30 PM - 10:30 PM IST) ──
  const londonStart = 13 * 60 + 30;
  const londonEnd = 22 * 60 + 30;
  let londonStatus = "closed";
  if (!isWeekend) {
    if (totalMins >= (londonStart - 30) && totalMins < londonStart) londonStatus = "pre";
    else if (totalMins >= londonStart && totalMins < londonEnd) londonStatus = "open";
  }
  const londonText = document.getElementById("londonStatusText");
  const londonItem = document.getElementById("londonSessionItem");
  if (londonText) {
    if (londonStatus === "open") {
      londonText.innerHTML = "🟢 London";
      londonText.classList.add("active");
    } else if (londonStatus === "pre") {
      londonText.innerHTML = "🟡 London";
      londonText.classList.add("active");
    } else {
      londonText.innerHTML = "London";
      londonText.classList.remove("active");
    }
  }
  if (londonItem) {
    if (londonStatus === "open" || londonStatus === "pre") {
      londonItem.classList.add("active");
    } else {
      londonItem.classList.remove("active");
    }
  }

  // ── New York Forex Session (Mon-Fri 6:30 PM - 1:30 AM IST) ──
  let nyStatus = "closed";
  if (!isWeekend) {
    if (totalMins >= 18*60 && totalMins < 18*60+30) nyStatus = "pre";
    else if (totalMins >= 18*60+30 || totalMins < 1*60+30) nyStatus = "open";
  }
  const nyText = document.getElementById("nyStatusText");
  const nyItem = document.getElementById("nySessionItem");
  if (nyText) {
    if (nyStatus === "open") {
      nyText.innerHTML = "🟢 New York";
      nyText.classList.add("active");
    } else if (nyStatus === "pre") {
      nyText.innerHTML = "🟡 New York";
      nyText.classList.add("active");
    } else {
      nyText.innerHTML = "New York";
      nyText.classList.remove("active");
    }
  }
  if (nyItem) {
    if (nyStatus === "open" || nyStatus === "pre") {
      nyItem.classList.add("active");
    } else {
      nyItem.classList.remove("active");
    }
  }

  // Ensure Crypto is always active
  const cryptoItem = document.getElementById("cryptoSessionItem");
  if (cryptoItem) {
    cryptoItem.classList.add("active");
  }

  // Update individual tooltips dynamically (NSE, London, New York)
  const nseTooltip = document.getElementById("nseTooltip");
  if (nseTooltip) {
    const statusText = nseStatus === "open" ? "Live" : (nseStatus === "pre" ? "Pre-Open" : "Closed");
    const statusColor = nseStatus === "open" ? "#00ff9c" : (nseStatus === "pre" ? "#ffb700" : "#ff6b6b");
    const statusIndicator = nseStatus === "open" ? "🟢" : (nseStatus === "pre" ? "🟡" : "🔴");
    
    let timingRow = "";
    if (nseStatus === "open") {
      timingRow = `<div style="display: flex; justify-content: space-between;"><span>Closes in</span><span style="font-weight:600;">${countdownText.replace("Closes in ", "")}</span></div>`;
    } else if (nseStatus === "pre") {
      timingRow = `<div style="display: flex; justify-content: space-between;"><span>Opening in</span><span style="font-weight:600;">09:15 AM</span></div>`;
    } else {
      timingRow = `<div style="display: flex; justify-content: space-between;"><span>Opens in</span><span style="font-weight:600;">${countdownText.replace("Opens in ", "")}</span></div>`;
    }

    nseTooltip.innerHTML = `
      <strong class="sessions-tooltip-header">${statusIndicator} NSE (India)</strong>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between;"><span>Status</span><span style="font-weight:600; color:${statusColor};">${statusText}</span></div>
        ${timingRow}
        <div style="display: flex; justify-content: space-between;"><span>Opens</span><span style="font-weight:600;">09:15 AM IST</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Closes</span><span style="font-weight:600;">03:30 PM IST</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Pre-Open</span><span style="font-weight:600;">09:00 AM IST</span></div>
      </div>
    `;
  }

  // London Forex Session (Mon-Fri 1:30 PM - 10:30 PM IST)
  let londonCountdown = "";
  if (isWeekend) {
    londonCountdown = "Opens Monday";
  } else if (totalMins < londonStart) {
    const diff = londonStart - totalMins;
    londonCountdown = `${String(Math.floor(diff / 60)).padStart(2, '0')}h ${String(diff % 60).padStart(2, '0')}m`;
  } else if (totalMins >= londonEnd) {
    const diff = (24 * 60 - totalMins) + londonStart;
    londonCountdown = `${String(Math.floor(diff / 60)).padStart(2, '0')}h ${String(diff % 60).padStart(2, '0')}m`;
  }

  const londonTooltip = document.getElementById("londonTooltip");
  if (londonTooltip) {
    const statusText = londonStatus === "open" ? "Live" : (londonStatus === "pre" ? "Pre-Open" : "Closed");
    const statusColor = londonStatus === "open" ? "#00ff9c" : (londonStatus === "pre" ? "#ffb700" : "#ff6b6b");
    const statusIndicator = londonStatus === "open" ? "🟢" : (londonStatus === "pre" ? "🟡" : "🔴");
    
    let timingRow = "";
    if (londonStatus === "open") {
      const diff = londonEnd - totalMins;
      timingRow = `<div style="display: flex; justify-content: space-between;"><span>Closes in</span><span style="font-weight:600;">${String(Math.floor(diff / 60)).padStart(2, '0')}h ${String(diff % 60).padStart(2, '0')}m</span></div>`;
    } else {
      timingRow = `<div style="display: flex; justify-content: space-between;"><span>Opens in</span><span style="font-weight:600;">${londonCountdown}</span></div>`;
    }

    londonTooltip.innerHTML = `
      <strong class="sessions-tooltip-header">${statusIndicator} London Forex</strong>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between;"><span>Status</span><span style="font-weight:600; color:${statusColor};">${statusText}</span></div>
        ${timingRow}
        <div style="display: flex; justify-content: space-between;"><span>Session</span><span style="font-weight:600;">01:30 PM - 10:30 PM IST</span></div>
      </div>
    `;
  }

  // New York Forex Session (Mon-Fri 6:30 PM - 1:30 AM IST next day)
  let nyCountdown = "";
  if (isWeekend) {
    nyCountdown = "Opens Monday";
  } else {
    if (nyStatus === "open") {
      let diff = 0;
      if (totalMins >= 18 * 60 + 30) {
        diff = (24 * 60 - totalMins) + 90;
      } else {
        diff = 90 - totalMins;
      }
      nyCountdown = `${String(Math.floor(diff / 60)).padStart(2, '0')}h ${String(diff % 60).padStart(2, '0')}m`;
    } else {
      let diff = 0;
      if (totalMins >= 90) {
        diff = (18 * 60 + 30) - totalMins;
      } else {
        diff = 90 - totalMins; // fallback (already open if < 90)
      }
      nyCountdown = `${String(Math.floor(diff / 60)).padStart(2, '0')}h ${String(diff % 60).padStart(2, '0')}m`;
    }
  }

  const nyTooltip = document.getElementById("nyTooltip");
  if (nyTooltip) {
    const statusText = nyStatus === "open" ? "Live" : (nyStatus === "pre" ? "Pre-Open" : "Closed");
    const statusColor = nyStatus === "open" ? "#00ff9c" : (nyStatus === "pre" ? "#ffb700" : "#ff6b6b");
    const statusIndicator = nyStatus === "open" ? "🟢" : (nyStatus === "pre" ? "🟡" : "🔴");
    
    let timingRow = "";
    if (nyStatus === "open") {
      timingRow = `<div style="display: flex; justify-content: space-between;"><span>Closes in</span><span style="font-weight:600;">${nyCountdown}</span></div>`;
    } else {
      timingRow = `<div style="display: flex; justify-content: space-between;"><span>Opens in</span><span style="font-weight:600;">${nyCountdown}</span></div>`;
    }

    nyTooltip.innerHTML = `
      <strong class="sessions-tooltip-header">${statusIndicator} New York Forex</strong>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between;"><span>Status</span><span style="font-weight:600; color:${statusColor};">${statusText}</span></div>
        ${timingRow}
        <div style="display: flex; justify-content: space-between;"><span>Session</span><span style="font-weight:600;">06:30 PM - 01:30 AM IST</span></div>
      </div>
    `;
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
  document.addEventListener('DOMContentLoaded', () => {
    initStats();
    initNotifications();
  });
} else {
  initStats();
  initNotifications();
}

// =============================================
// TRADELAB INBOX & NEWS INTELLIGENCE DRAWER SYSTEM
// =============================================
let notifications = JSON.parse(localStorage.getItem('terminalNotifications')) || [
  { id: 101, text: "BTCUSD crossed ₹5,200,000 target", read: false, category: "Alerts", timestamp: new Date().getTime() - 600000 },
  { id: 102, text: "NSE India opened for regular trading session", read: false, category: "Updates", timestamp: new Date().getTime() - 3600000 },
  { id: 103, text: "Lesson 'Learn Trendlines' unlocked!", read: false, category: "Updates", timestamp: new Date().getTime() - 14400000 }
];

let newsFeed = JSON.parse(localStorage.getItem('terminalNewsFeed')) || [
  { id: 1, text: "US Fed signals rate cuts in next meeting, global markets surge", read: false, category: "Breaking", impact: "high", timestamp: new Date().getTime() - 120000, saved: false, link: "https://finance.yahoo.com" },
  { id: 2, text: "SEBI introduces new margin limits for option trading indexes", read: false, category: "NSE", impact: "medium", timestamp: new Date().getTime() - 1800000, saved: false },
  { id: 3, text: "Solana DEX volume surpasses Ethereum for third consecutive day", read: false, category: "Crypto", impact: "low", timestamp: new Date().getTime() - 7200000, saved: false }
];

function getEventTimestamp(hoursOffset) {
  return new Date().getTime() + hoursOffset * 60 * 60 * 1000;
}

let economicEvents = JSON.parse(localStorage.getItem('inboxEconomicEvents')) || [
  { id: 201, title: "US FOMC Interest Rate Decision", time: "Upcoming Today", timestamp: getEventTimestamp(2.5), impact: "high", stars: 5, category: "FOMC", saved: false },
  { id: 202, title: "RBI Monetary Policy Meeting Minutes", time: "Tomorrow, 10:00 AM", timestamp: getEventTimestamp(15.5), impact: "high", stars: 4, category: "RBI", saved: false },
  { id: 203, title: "US Core CPI Inflation YoY", time: "In 2 days", timestamp: getEventTimestamp(42), impact: "high", stars: 5, category: "CPI", saved: false },
  { id: 204, title: "India GDP Growth Rate Q1", time: "In 4 days", timestamp: getEventTimestamp(90), impact: "medium", stars: 3, category: "GDP", saved: false }
];

let marketSentiment = { status: "Bullish", confidence: 72, lastUpdated: new Date().getTime() };

window.activeInboxTab = 'all';
window.inboxSearchQuery = '';
window.isFetchingNews = false;

function initNotifications() {
  renderNotifications();
  if (!sessionStorage.getItem('welcomeNotified')) {
    setTimeout(() => {
      addNotification("Welcome to TradeLab AI (Beta) - Trading Intelligence Center Active!");
      sessionStorage.setItem('welcomeNotified', 'true');
    }, 2000);
  }
  setInterval(() => {
    const ap = document.getElementById("alertsPanel");
    if (ap && ap.classList.contains("show")) renderNotifications();
  }, 30000);
}

function getRelativeTimeString(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "Just now";
  const m = Math.floor(diff / 60000);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

function getEventCountdown(ts) {
  const diff = ts - Date.now();
  if (diff <= 0) return "Started";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) return "In " + Math.floor(h / 24) + "d";
  if (h > 0) return "In " + h + "h " + m + "m";
  return "In " + m + "m";
}

function generateAISummary(news, events) {
  const kw = [];
  if (news && news.length > 0) {
    news.slice(0, 3).forEach(n => {
      const t = n.text.toUpperCase();
      if (t.includes("FED")) kw.push("Fed Rate Action");
      else if (t.includes("SEBI")) kw.push("SEBI rules");
      else if (t.includes("SOLANA") || t.includes("SOL")) kw.push("Solana dex active");
      else if (t.includes("BTC") || t.includes("BITCOIN")) kw.push("BTC rising");
      else if (t.includes("GOLD")) kw.push("Gold weak");
      else kw.push(n.text.split(" ").slice(0, 2).join(" "));
    });
  }
  if (events && events.length > 0) {
    events.slice(0, 2).forEach(ev => kw.push(ev.category + " event coming"));
  }
  if (kw.length === 0) kw.push("Bitcoin stable", "Markets mixed", "RBI meeting soon", "Volatility low");
  const unique = [...new Set(kw)].slice(0, 4);
  return '<div class="ai-summary-card"><div class="ai-summary-header"><span class="ai-summary-title">🤖 AI Market Summary</span><span class="ai-summary-pill">Latest</span></div><div class="ai-summary-list">' + unique.map(k => '<span class="ai-summary-item">💡 ' + k + '</span>').join('') + '</div></div>';
}

function renderNotifications() {
  const contentDiv = document.getElementById("alertsPanelContent");
  if (!contentDiv) return;
  const query = window.inboxSearchQuery;
  const tab = window.activeInboxTab;

  let filteredEvents = economicEvents.filter(ev => {
    const ms = !query || ev.title.toLowerCase().includes(query) || ev.category.toLowerCase().includes(query);
    const mt = (tab === 'all' || tab === 'events') || (tab === 'saved' && ev.saved);
    return ms && mt;
  });

  let filteredNews = newsFeed.filter(n => {
    const ms = !query || n.text.toLowerCase().includes(query) || (n.category && n.category.toLowerCase().includes(query));
    let mt = false;
    if (tab === 'all') mt = true;
    else if (tab === 'news') mt = ['Breaking','NSE','Crypto','Market','Stocks'].includes(n.category);
    else if (tab === 'saved') mt = n.saved;
    return ms && mt;
  });

  let filteredNotifs = notifications.filter(n => {
    const ms = !query || n.text.toLowerCase().includes(query) || (n.category && n.category.toLowerCase().includes(query));
    let mt = false;
    if (tab === 'all') mt = true;
    else if (tab === 'alerts') mt = (n.category === 'Alerts');
    else if (tab === 'updates') mt = (n.category === 'Updates');
    return ms && mt;
  });

  // Update badges
  const uc = notifications.filter(n => !n.read).length;
  const nc = newsFeed.filter(n => !n.read).length;
  const bb = document.getElementById("alertIndicatorBtn");
  if (bb) { const s = bb.querySelector("span:first-child"); if (s) s.textContent = uc > 0 ? "🔔 " + uc : "🔔"; }
  const nb = document.getElementById("newsIndicatorBtn");
  if (nb) { const s = nb.querySelector("span:first-child"); if (s) s.textContent = nc > 0 ? "📰 " + nc : "📰"; }

  if (filteredEvents.length === 0 && filteredNews.length === 0 && filteredNotifs.length === 0) {
    contentDiv.innerHTML = '<div class="inbox-empty-state"><span class="inbox-empty-icon">🎉</span><span class="inbox-empty-title">You\'re all caught up!</span><span class="inbox-empty-text">No important market updates right now.<br>We\'ll notify you when something important happens.</span></div>';
    return;
  }

  let html = '<div class="inbox-main-scroll">';

  // Sentiment Card
  if (tab === 'all' || tab === 'events') {
    const sc = marketSentiment.status === "Bullish" ? "#00ff9c" : "#ff4d4d";
    html += '<div class="sentiment-card"><div class="sentiment-left"><span class="sentiment-title">📊 Market Sentiment</span><span class="sentiment-value" style="color:' + sc + '"><span class="sentiment-dot" style="background:' + sc + ';box-shadow:0 0 8px ' + sc + '"></span>' + marketSentiment.status + '</span></div><div class="sentiment-right"><span class="sentiment-confidence">Confidence: ' + marketSentiment.confidence + '%</span><span class="sentiment-updated">Updated 5 min ago</span></div></div>';
  }

  // AI Summary
  if (tab === 'all' || tab === 'news') {
    html += generateAISummary(filteredNews, filteredEvents);
  }

  // Economic Calendar
  if ((tab === 'all' || tab === 'events' || tab === 'saved') && filteredEvents.length > 0) {
    html += '<div><h4 class="inbox-section-title">📅 Economic Calendar</h4>';
    filteredEvents.forEach(ev => {
      const cd = getEventCountdown(ev.timestamp);
      const bk = ev.saved ? "★" : "☆";
      const bc = ev.saved ? "inbox-btn-icon save-active" : "inbox-btn-icon";
      const st = "★".repeat(ev.stars) + "☆".repeat(5 - ev.stars);
      html += '<div class="calendar-event-card"><div class="event-header"><span class="event-title">' + ev.title + '</span><span class="event-badge ' + ev.impact + '">' + ev.impact + ' Impact</span></div><div class="event-footer"><div class="event-time-info"><span>⏰ ' + ev.time + '</span><span class="event-countdown">' + cd + '</span></div><div style="display:flex;align-items:center;gap:8px"><span class="event-stars" title="' + ev.stars + ' Star Impact">' + st + '</span><button onclick="toggleBookmarkEvent(' + ev.id + ',event)" class="' + bc + '" title="Bookmark">' + bk + '</button></div></div></div>';
    });
    html += '</div>';
  }

  // Combined news + notifications
  let combined = [];
  filteredNews.forEach(n => combined.push({ type:"news", id:n.id, text:n.text, read:n.read, category:n.category, impact:n.impact, timestamp:n.timestamp, saved:n.saved, link:n.link||null }));
  filteredNotifs.forEach(n => combined.push({ type:"notification", id:n.id, text:n.text, read:n.read, category:n.category, impact:"low", timestamp:n.timestamp, saved:false, link:null }));
  combined.sort((a, b) => b.timestamp - a.timestamp);

  if (combined.length > 0) {
    const lt = tab === 'saved' ? "⭐ Bookmarked Updates" : "🚨 Important updates & news";
    html += '<div><h4 class="inbox-section-title">' + lt + '</h4>';
    combined.forEach(item => {
      const uc2 = item.read ? "" : " unread";
      const pl = item.category === "Breaking" ? "🔥 Breaking" : item.category;
      let pc = "low";
      if (item.category === "Breaking") pc = "breaking";
      else if (item.impact === "high") pc = "high-impact";
      else if (item.category === "Alerts") pc = "medium";
      const ts2 = getRelativeTimeString(item.timestamp);
      const sc2 = item.saved ? "★" : "☆";
      const sbc = item.saved ? "inbox-btn-icon save-active" : "inbox-btn-icon";
      const bmk = item.type === "news" ? '<button onclick="toggleBookmarkNews(\'' + item.id + '\',event)" class="' + sbc + '" title="Bookmark">' + sc2 + '</button>' : "";
      const rml = item.link ? '<a href="' + item.link + '" target="_blank" onclick="markInboxItemRead(\'' + item.id + '\',event)" class="inbox-card-link">Read More →</a>' : "";
      html += '<div class="inbox-card' + uc2 + '" onclick="markInboxItemRead(\'' + item.id + '\',event)"><div class="inbox-card-meta"><div class="inbox-card-left"><span class="inbox-priority-tag ' + pc + '">' + pl + '</span></div><span class="inbox-card-time">' + ts2 + '</span></div><div class="inbox-card-body">' + item.text + '</div><div class="inbox-card-actions">' + rml + '<div class="inbox-card-right-actions">' + bmk + '<button onclick="dismissInboxItem(\'' + item.id + '\',event)" class="inbox-btn-icon dismiss-btn" title="Dismiss">✕</button></div></div></div>';
    });
    html += '</div>';
  }

  html += '</div>';
  contentDiv.innerHTML = html;
}

window.setInboxTab = function(tabName, btn) {
  window.activeInboxTab = tabName;
  document.querySelectorAll(".inbox-tab").forEach(t => t.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderNotifications();
};

window.handleInboxSearch = function(val) {
  window.inboxSearchQuery = val.toLowerCase().trim();
  renderNotifications();
};

window.showClearInboxConfirm = function() {
  const o = document.getElementById("inboxConfirmOverlay");
  if (o) o.classList.add("show");
};

window.hideClearInboxConfirm = function() {
  const o = document.getElementById("inboxConfirmOverlay");
  if (o) o.classList.remove("show");
};

window.confirmClearAllInbox = function() {
  notifications = [];
  newsFeed = [];
  localStorage.setItem('terminalNotifications', JSON.stringify(notifications));
  localStorage.setItem('terminalNewsFeed', JSON.stringify(newsFeed));
  hideClearInboxConfirm();
  renderNotifications();
};

window.toggleBookmarkNews = function(id, ev) {
  if (ev) ev.stopPropagation();
  newsFeed = newsFeed.map(n => { if (n.id == id) n.saved = !n.saved; return n; });
  localStorage.setItem('terminalNewsFeed', JSON.stringify(newsFeed));
  renderNotifications();
};

window.toggleBookmarkEvent = function(id, ev) {
  if (ev) ev.stopPropagation();
  economicEvents = economicEvents.map(e => { if (e.id == id) e.saved = !e.saved; return e; });
  localStorage.setItem('inboxEconomicEvents', JSON.stringify(economicEvents));
  renderNotifications();
};

window.markInboxItemRead = function(id, ev) {
  if (ev) ev.stopPropagation();
  notifications = notifications.map(n => { if (n.id == id) n.read = true; return n; });
  newsFeed = newsFeed.map(n => { if (n.id == id) n.read = true; return n; });
  localStorage.setItem('terminalNotifications', JSON.stringify(notifications));
  localStorage.setItem('terminalNewsFeed', JSON.stringify(newsFeed));
  renderNotifications();
};

window.dismissInboxItem = function(id, ev) {
  if (ev) ev.stopPropagation();
  notifications = notifications.filter(n => n.id != id);
  newsFeed = newsFeed.filter(n => n.id != id);
  localStorage.setItem('terminalNotifications', JSON.stringify(notifications));
  localStorage.setItem('terminalNewsFeed', JSON.stringify(newsFeed));
  renderNotifications();
};

window.markAllInboxRead = function() {
  notifications.forEach(n => n.read = true);
  newsFeed.forEach(n => n.read = true);
  localStorage.setItem('terminalNotifications', JSON.stringify(notifications));
  localStorage.setItem('terminalNewsFeed', JSON.stringify(newsFeed));
  renderNotifications();
};

window.addNotification = function(text) {
  const nid = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
  notifications.unshift({ id: nid, text: text, read: false, category: "Alerts", timestamp: Date.now() });
  localStorage.setItem('terminalNotifications', JSON.stringify(notifications));
  renderNotifications();
  const bb2 = document.getElementById("alertIndicatorBtn");
  if (bb2) { const bi = bb2.querySelector("span:first-child"); if (bi) { bi.classList.remove("bell-bounce"); void bi.offsetWidth; bi.classList.add("bell-bounce"); } }
};

// Newsdata.io live API integration
async function fetchLiveNews() {
  const apiKey = "pub_489b69bf8d9042209ddb68ccb2c9cc67";
  const url = "https://newsdata.io/api/1/news?apikey=" + apiKey + "&q=crypto%20OR%20market%20OR%20finance%20OR%20stocks&language=en";
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === "success" && data.results) {
      const fetched = data.results.slice(0, 10).map((art, i) => {
        let cat = "Market";
        const tu = art.title.toUpperCase();
        if (tu.includes("FED") || tu.includes("RATE") || tu.includes("BREAKING") || tu.includes("SEBI") || tu.includes("RBI")) cat = "Breaking";
        else if (tu.includes("BTC") || tu.includes("BITCOIN") || tu.includes("CRYPTO") || tu.includes("ETH") || tu.includes("SOLANA")) cat = "Crypto";
        else if (tu.includes("STOCK") || tu.includes("NIFTY") || tu.includes("NSE") || tu.includes("SENSEX")) cat = "Stocks";
        let imp = "medium";
        if (cat === "Breaking" || tu.includes("SURGES") || tu.includes("CRASH") || tu.includes("SPIKES")) imp = "high";
        return { id: "live-" + (art.article_id || i), text: art.title, read: false, category: cat, impact: imp, timestamp: art.pubDate ? new Date(art.pubDate).getTime() : Date.now(), saved: false, link: art.link || "#" };
      });
      let local = JSON.parse(localStorage.getItem('terminalNewsFeed')) || [];
      const texts = new Set(local.map(n => n.text));
      fetched.forEach(item => { if (!texts.has(item.text)) local.unshift(item); });
      local = local.slice(0, 40);
      newsFeed = local;
      localStorage.setItem('terminalNewsFeed', JSON.stringify(newsFeed));
      renderNotifications();
    }
  } catch (err) { console.warn("Failed to fetch live news:", err); }
}

window.refreshLiveNews = async function() {
  if (window.isFetchingNews) return;
  window.isFetchingNews = true;
  const icon = document.querySelector(".alerts-panel-header .inbox-btn-icon");
  if (icon) { icon.style.transition = "transform 1s linear"; icon.style.transform = "rotate(360deg)"; }
  await fetchLiveNews();
  window.isFetchingNews = false;
  if (icon) { icon.style.transform = "none"; icon.style.transition = "none"; }
};

