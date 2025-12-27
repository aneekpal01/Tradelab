// TradeLab future scripts


// --- NAVBAR HAMBURGER MENU LOGIC ---
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

function toggleMenu() {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
}

// --- AI CHATBOT LOGIC (TradeLab Mentor) ---
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// 1. Chat Window Show/Hide karne ke liye
function toggleChat() {
    if (chatContainer.style.display === "flex") {
        chatContainer.style.display = "none";
    } else {
        chatContainer.style.display = "flex";
        // Chat khulte hi input par focus aa jaye
        if(userInput) userInput.focus(); 
    }
}

// 2. Quick Buttons (Chips) par click hone par
function sendQuickMsg(text) {
    userInput.value = text;
    sendMessage();
}

// 3. Enter button dabane par message bhejne ke liye
function handleEnter(event) {
    if (event.key === "Enter") sendMessage();
}

// 4. Text Formatting (Bold aur Lines theek karne ke liye)
function formatResponse(text) {
    // **text** ko Bold banata hai
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // New lines ko <br> mein badalta hai
    return formatted.replace(/\n/g, '<br>');
}

// 5. Message Bhejne ka Main Function (OpenAI API)
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // User ka message screen par dikhayein
    appendMessage(text, "user-message");
    userInput.value = "";

    // "Thinking..." loading dikhayein
    const loadingId = appendMessage("Thinking...", "bot-message");

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 🔴 APNI OPENAI API KEY NEECHE PASTE KAREIN 🔴
                "Authorization": "Bearer YOUR_OPENAI_API_KEY" 
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system", 
                        content: "You are a professional Trading Mentor for 'TradeLab'. Answer clearly in Hinglish (Hindi + English mix). Focus on Psychology, Risk Management, and clear explanations. Keep answers short and crisp."
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const data = await response.json();
        
        // Agar API Key galat ho toh error dikhaye
        if(data.error) {
             document.getElementById(loadingId).innerText = "Error: API Key missing or invalid.";
             console.error("API Error:", data.error);
             return;
        }

        const botReply = data.choices[0].message.content;
        
        // Loading hatakar asli jawab dikhayein
        document.getElementById(loadingId).remove();
        
        const msgDiv = document.createElement("div");
        msgDiv.className = "bot-message";
        msgDiv.innerHTML = formatResponse(botReply);
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        document.getElementById(loadingId).innerText = "Connection Error. Check internet.";
        console.error(error);
    }
}

// Helper: Message ko chat box mein add karna
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

