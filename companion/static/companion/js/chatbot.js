
console.log("Crick AI chatbot.js loaded");

function initChatbot() {
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const chatSendBtn = document.getElementById("chatSendBtn");
    const recapButtons = document.querySelectorAll(".recap-btn");

    const CHAT_API = "/api/chat/";
    const RECAP_API = "/api/recap/";

    let isBusy = false;
    let previousRecap = "";

    console.log("Crick AI initialized");
    console.log("Recap buttons found:", recapButtons.length);

    // Display messages in the chatbot
    function addMessage(message, sender) {
        if (!chatMessages) return;

        const messageDiv = document.createElement("div");

        messageDiv.className =
            sender === "user"
                ? "chat-message user-msg"
                : "chat-message ai-msg";

        const avatar = document.createElement("div");
        avatar.className = "msg-avatar";

        const icon = document.createElement("i");
        icon.className = sender === "user"
            ? "fa-solid fa-user"
            : "fa-solid fa-robot";

        avatar.appendChild(icon);

        const content = document.createElement("div");
        content.className = "msg-content";

        const paragraph = document.createElement("p");
        paragraph.textContent = message;

        content.appendChild(paragraph);
        messageDiv.append(avatar, content);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show AI typing indicator
    function showTyping() {
        removeTyping();

        const typing = document.createElement("div");
        typing.className = "chat-message ai-msg";
        typing.id = "aiTyping";

        const avatar = document.createElement("div");
        avatar.className = "msg-avatar";

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-robot";
        avatar.appendChild(icon);

        const content = document.createElement("div");
        content.className = "msg-content";

        const paragraph = document.createElement("p");
        paragraph.textContent = "Crick AI is analyzing the match...";

        content.appendChild(paragraph);
        typing.append(avatar, content);

        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTyping() {
        document.getElementById("aiTyping")?.remove();
    }

    // Lock both chat and recap controls during a request
    function setBusy(busy) {
        isBusy = busy;

        if (chatSendBtn) {
            chatSendBtn.disabled = busy;
        }

        recapButtons.forEach(button => {
            button.disabled = busy;
        });
    }

    // Normal chatbot questions
    async function sendMessage(text) {
        if (isBusy) return;

        const message = text || chatInput?.value.trim();

        if (!message) return;

        addMessage(message, "user");

        if (chatInput) {
            chatInput.value = "";
        }

        setBusy(true);
        showTyping();

        try {
            const response = await fetch(CHAT_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message,
                    score: document.getElementById("indScore")?.innerText || "N/A",
                    overs: document.getElementById("indOvers")?.innerText || "N/A",
                    batter1: document.getElementById("batter1Name")?.innerText || "N/A",
                    batter2: document.getElementById("batter2Name")?.innerText || "N/A",
                    bowler: document.getElementById("bowlerName")?.innerText || "N/A",
                    previous_recap: previousRecap
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Chat request failed");
            }

            removeTyping();

            addMessage(
                data.reply || "I couldn't generate an answer. Please try again.",
                "ai"
            );

        } catch (error) {
            console.error("Chat API error:", error);

            removeTyping();

            addMessage(
                "Sorry, I couldn't generate an answer. Please try again.",
                "ai"
            );

        } finally {
            removeTyping();
            setBusy(false);
            chatInput?.focus();
        }
    }

    // Smart Match Recap
    async function generateRecap(overs) {
        if (isBusy) return;

        if (![5, 10, 15, 20].includes(overs)) {
            console.error("Invalid recap selection:", overs);
            return;
        }

        const prompt = overs === 20
            ? "Generate a full match recap."
            : `Generate a recap of the first ${overs} overs.`;

        // Show recap request as a user message
        addMessage(prompt, "user");

        recapButtons.forEach(button => {
            button.classList.toggle(
                "active",
                Number(button.dataset.overs) === overs
            );
        });

        setBusy(true);
        showTyping();

        try {
            const response = await fetch(RECAP_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    overs: overs
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Recap generation failed");
            }

            if (!data.recap) {
                throw new Error("No recap received from server");
            }

            // Save recap so follow-up questions receive it
            previousRecap = data.recap;

            removeTyping();

            // Display recap as an AI chatbot response
            addMessage(data.recap, "ai");

        } catch (error) {
            console.error("Recap API error:", error);

            removeTyping();

            addMessage(
                "I couldn't generate the recap. Please try again.",
                "ai"
            );

        } finally {
            removeTyping();
            setBusy(false);
        }
    }

    // Chat input events
    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener("click", () => sendMessage());

        chatInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }
        });
    }

    // Recap button events
    recapButtons.forEach(button => {
        button.addEventListener("click", () => {
            const overs = Number(button.dataset.overs);
            generateRecap(overs);
        });
    });
}

// Initialize after page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
} else {
    initChatbot();
}
