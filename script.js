// --- NAVBAR HAMBURGER MENU LOGIC ---
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

function toggleMenu() {
    if (navLinks && hamburger) {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("active");
    }
}

// --- AI CHATBOT LOGIC (Updated for Gemini 1.5 Flash) ---
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// 🟢 AAPKI API KEY (Ye wahi hai jo aapne banayi thi)
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
    // Bold text handling
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // New lines handling
    return formatted.replace(/\n/g, '<br>');
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, "user-message");
    userInput.value = "";

    // Loading msg dikhana
    const loadingId = appendMessage("Thinking...", "bot-message");

    // System Prompt
    const systemPrompt = "You are a professional Trading Mentor for 'TradeLab'. Answer clearly in Hinglish. Focus on Psychology and Risk Management. Keep answers short.";

    try {
        // 👇 UPDATED: Using the latest 'gemini-1.5-flash' model
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
            // Agar loading element hai toh usme error dikhao
            const loadingElem = document.getElementById(loadingId);
            if(loadingElem) {
                loadingElem.innerText = "Error: " + data.error.message;
                loadingElem.style.color = "red";
            }
            console.error("Gemini Error:", data.error);
            return;
        }

        // Response aane par
        const botReply = data.candidates[0].content.parts[0].text;
        
        // Loading hatana
        const loadingElem = document.getElementById(loadingId);
        if(loadingElem) loadingElem.remove();
        
        // Asli message dikhana
        const msgDiv = document.createElement("div");
        msgDiv.className = "bot-message";
        msgDiv.innerHTML = formatResponse(botReply);
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        // Network Error handling
        const loadingElem = document.getElementById(loadingId);
        if(loadingElem) loadingElem.innerText = "Connection Error. Try again.";
        console.error(error);
    }
}

// 👇 FIX: Is function mein 'id' assign karna bhool gaya tha, ab theek hai
function appendMessage(text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.className = className;
    msgDiv.innerHTML = text; // Formatting support
    
    const id = "msg-" + Date.now();
    msgDiv.id = id; // ✅ YE LINE MISSING THI, AB ADD KAR DI HAI
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}
