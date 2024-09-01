import { Chatbot } from "../../src/Chatbot";

describe("Chatbot", () => {
    let chatbot: Chatbot;

    beforeEach(() => {
        // Crée une instance de Chatbot avant chaque test
        document.body.innerHTML = `
            <textarea id="userInput"></textarea>
            <button id="toggleButton"></button>
            <div id="chatbot" class="hidden"></div>
            <button id="closeButton"></button>
            <button id="sendButton"></button>
            <div id="chatbox"></div>
            <div class="chat-header"></div>
            <div id="chatbotloader" class="hidden"></div>
            <div id="sendChatMessageIcon"></div>
        `;
        chatbot = new Chatbot();
    });

    it("should format text with markdown correctly", () => {
        const input = "## Title";
        const formattedText = chatbot["formatText"](input); // Utilisation de l'indexation pour accéder à une méthode privée
        expect(formattedText).toBe("<h2>Title</h2>");
    });

    // Ajoutez d'autres tests pour chaque fonctionnalité
});
bin;
