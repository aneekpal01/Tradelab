// --- NAVBAR HAMBURGER MENU LOGIC ---
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

function toggleMenu() {
    if (navLinks && hamburger) {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("active");
    }
}

// --- AI CHATBOT LOGIC (Google Gemini Powered) ---
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// 🟢 AAPKI GOOGLE API KEY (Maine yahan daal di hai)
const API_KEY = "AIzaSyAfwrM3u2a7aZx1BlXCriaEGp7zyseMF-0"; 

function toggleChat() {
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
    // Bold text handling (**text**)
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // New lines handling
    return formatted.replace(/\n/g, '<br>');
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, "user-message");
    userInput.value = "";

    const loadingId = appendMessage("Thinking...", "bot-message");

    // System Prompt (Bot ka dimaag)
    const systemPrompt = "You are a professional Trading Mentor for 'TradeLab'. Answer clearly in Hinglish (Hindi + English mix). Focus on Psychology, Risk Management, and clear explanations. Keep answers short and crisp. Do not give financial advice.";

    // Gemini API ko request bhejna
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt + "\n\nUser Question: " + text
                    }]
                }]
            })
        });

        const data = await response.json();

        // Error checking
        if (data.error) {
            document.getElementById(loadingId).innerText = "Error: API Key limit or invalid.";
            console.error("Gemini Error:", data.error);
            return;
        }

        // Gemini ka jawab nikalna
        const botReply = data.candidates[0].content.parts[0].text;

        document.getElementById(loadingId).remove();
        
        const msgDiv = document.createElement("div");
        msgDiv.className = "bot-message";
        msgDiv.innerHTML = formatResponse(botReply);
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        document.getElementById(loadingId).innerText = "Connection Error. Try again.";
        console.error(error);
    }
}

function appendMessage(text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.className = className;
    msgDiv.innerText = text;
    const id = "msg-" + Date.now();
    msgDiv.id = id;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}
