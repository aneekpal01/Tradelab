// --- NAVBAR HAMBURGER MENU LOGIC ---
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

function toggleMenu() {
    if (navLinks && hamburger) {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("active");
    }
}

// --- AI CHATBOT LOGIC (Final Working Version) ---
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// 🟢 AAPKI NAYI API KEY (Maine yahan daal di hai)
const API_KEY = "AIzaSyDvFBizewUa7wC1c_H2upSOWLwGqt6LS8I"; 

function toggleChat() {
    if (!chatContainer) return;
    if (chatContainer.style.display === "flex") {
        chatContainer.style.display = "none";
    } else {
        chatContainer.style.display = "flex";
        if(userInput) userInput.focus(); 
    }
}

function sendQuickMsg(text) {
    if(userInput) {
        userInput.value = text;
        sendMessage();
    }
}

function handleEnter(event) {
    if (event.key === "Enter") sendMessage();
}

function formatResponse(text) {
    // Bold text handling
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return formatted.replace(/\n/g, '<br>');
}

// Helper to add messages safely
function appendMessage(text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.className = className;
    msgDiv.innerHTML = text;
    
    // Unique ID generation (Crash Proof)
    const id = "msg-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    msgDiv.id = id; 
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, "user-message");
    userInput.value = "";

    // Show Loading
    const loadingId = appendMessage("Thinking...", "bot-message");

    const systemPrompt = "You are a professional Trading Mentor. Answer in Hinglish. Keep it short and clear.";

    try {
        // 👇 Using 'gemini-1.5-flash'
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\n\nUser: " + text }] }]
            })
        });

        const data = await response.json();
        
        // Safe Element Selection
        const loadingElem = document.getElementById(loadingId);

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            if(loadingElem) {
                loadingElem.innerHTML = "<span style='color:red'>Error: " + data.error.message + "</span>";
            }
            return;
        }

        // Response Success
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I am silent today.";
        
        if(loadingElem) loadingElem.remove();
        
        const msgDiv = document.createElement("div");
        msgDiv.className = "bot-message";
        msgDiv.innerHTML = formatResponse(botReply);
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error("Network Error:", error);
        const loadingElem = document.getElementById(loadingId);
        if(loadingElem) loadingElem.innerText = "Connection Error. Check internet.";
    }
}
