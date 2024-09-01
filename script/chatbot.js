document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggleButton");
    const chatbot = document.getElementById("chatbot");
    const closeButton = document.getElementById("closeButton");
    const sendButton = document.getElementById("sendButton");
    const userInput = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const chatHeader = document.querySelector(".chat-header");

    let isChatbotVisible = false;
    let isFirstOpen = true;
    let firstMessage = true;
    let baseUrl = "http://172.17.0.1:11080";
    let conversationId;

    function toggleChatbot() {
        isChatbotVisible = !isChatbotVisible;
        chatbot.classList.toggle("hidden", !isChatbotVisible);

        if (isChatbotVisible && isFirstOpen) {
            // Send a welcome message when chatbot is opened for the first time
            sendWelcomeMessage();
            isFirstOpen = false; // Set flag to false after first open
        }
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function generateResponse(message) {
        if (firstMessage == true) {
            //makeConversation
            return fetch(baseUrl + "/api/v1/conversations/Make", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Prompt: message, // Utilisation du message de l'utilisateur
                    lmName: "GPTModel", // Nom du modèle, fixé ici à "GPTModel"
                    context: "cot_66bc772deea93", // Contexte, ici fixé à une valeur donnée
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    conversationId = data.data.id;
                    return data.data.Answer;
                })
                .catch((error) => {
                    console.error("Error:", error);
                    return "Désolé nous rencontrons un problème";
                });
        } else {
            //continueConversation
            return fetch(
                baseUrl + "/api/v1/Conversations/continueConversation",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Prompt: message, // Utilisation du message de l'utilisateur
                        convId: conversationId,
                        lmName: "GPTModel", // Nom du modèle, fixé ici à "GPTModel"
                    }),
                },
            )
                .then((response) => response.json())
                .then((data) => {
                    hideLoader();
                    return data.data.Answer; // Supposons que la réponse de l'API se trouve dans la clé "response"
                })
                .catch((error) => {
                    console.error("Error:", error);
                    return "Désolé nous rencontrons un problème";
                });
        }
    }

    function handleUserMessage() {
        const message = userInput.value.trim();
        if (message) {
            const userMessageElement = document.createElement("div");
            userMessageElement.className = "user";
            userMessageElement.classList.add("message", "user-message");
            userMessageElement.innerHTML = `
            <span class="message-text"><b> You:</b> ${message}</span>
            <span class="timestamp">${getCurrentTime()}</span>`;
            chatbox.appendChild(userMessageElement);
            userInput.value = "";

            generateResponse(message).then((response) => {
                const botMessageElement = document.createElement("div");
                botMessageElement.className = "bot";
                botMessageElement.classList.add("message", "bot-message");
                botMessageElement.innerHTML = `<span class="message-text"> <b>
                Nextia:</b> ${response}</span><span class="timestamp">${getCurrentTime()}</span>`;
                chatbox.appendChild(botMessageElement);
                chatbox.scrollTop = chatbox.scrollHeight; // Scroll to bottom
            });
        }
    }

    function sendWelcomeMessage() {
        const welcomeMessage =
            "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
        const botMessageElement = document.createElement("div");
        botMessageElement.classList.add("message", "bot-message");
        botMessageElement.innerHTML = `
            <span class="message-text"><b>Nextia:</b> ${welcomeMessage}</span>
            <span class="timestamp">${getCurrentTime()}</span>`;
        chatbox.appendChild(botMessageElement);
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll to bottom
    }

    toggleButton.addEventListener("click", toggleChatbot);
    closeButton.addEventListener("click", toggleChatbot);
    sendButton.addEventListener("click", handleUserMessage);

    chatHeader.addEventListener("click", () => {
        if (isChatbotVisible) {
            toggleChatbot();
        }
    });
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            handleUserMessage();
        }
    });
});
