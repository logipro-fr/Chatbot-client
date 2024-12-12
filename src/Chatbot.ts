class Chatbot {
    private userInput: HTMLTextAreaElement;
    private toggleButton: HTMLButtonElement;
    private chatbot: HTMLElement;
    private closeButton: HTMLButtonElement;
    private sendButton: HTMLButtonElement;
    private chatbox: HTMLElement;
    private chatHeader: HTMLElement;
    private loader: HTMLElement;
    private sendMessage: HTMLElement;
    private isChatbotVisible: boolean = false;
    private isFirstOpen: boolean = true;
    private firstMessage: boolean = true;
    private baseUrl: string = "https://dev.chatbot.logipro.fr";
    private conversationId: string;

    constructor() {
        this.userInput = document.getElementById(
            "userInput",
        ) as HTMLTextAreaElement;
        this.toggleButton = document.getElementById(
            "toggleButton",
        ) as HTMLButtonElement;
        this.chatbot = document.getElementById("chatbot") as HTMLElement;
        this.closeButton = document.getElementById(
            "closeButton",
        ) as HTMLButtonElement;
        this.sendButton = document.getElementById(
            "sendButton",
        ) as HTMLButtonElement;
        this.chatbox = document.getElementById("chatbox") as HTMLElement;
        this.chatHeader = document.querySelector(".chat-header") as HTMLElement;
        this.loader = document.getElementById("chatbotloader") as HTMLElement;
        this.sendMessage = document.getElementById(
            "sendChatMessageIcon",
        ) as HTMLElement;

        this.initialize();
    }

    private initialize(): void {
        this.addEventListeners();
        this.adjustTextareaHeight();
    }

    private addEventListeners(): void {
        this.toggleButton.addEventListener("click", () => this.toggleChatbot());
        this.closeButton.addEventListener("click", () => this.toggleChatbot());
        this.sendButton.addEventListener("click", () =>
            this.handleUserMessage(),
        );
        this.chatHeader.addEventListener("click", () => {
            if (this.isChatbotVisible) {
                this.toggleChatbot();
            }
        });
        this.userInput.addEventListener("input", () =>
            this.adjustTextareaHeight(),
        );
        this.userInput.addEventListener("keypress", (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                this.handleUserMessage();
            }
        });
    }

    private adjustTextareaHeight(): void {
        this.userInput.style.height = "auto";
        this.userInput.style.height = this.userInput.scrollHeight + "px";
    }

    private toggleChatbot(): void {
        this.isChatbotVisible = !this.isChatbotVisible;
        this.chatbot.classList.toggle("hidden", !this.isChatbotVisible);

        if (this.isChatbotVisible && this.isFirstOpen) {
            this.sendWelcomeMessage();
            this.isFirstOpen = false;
        }
    }

    private getCurrentTime(): string {
        const now = new Date();
        return now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    private async generateResponse(message: string): Promise<string> {
        const url = this.firstMessage
            ? `${this.baseUrl}/api/v1/conversations/Make`
            : `${this.baseUrl}/api/v1/conversations/Continue`;

        const body = this.firstMessage
            ? JSON.stringify({
                  Prompt: message,
                  lmName: "GPTModel",
                  context: "cot_66cd8d2562393",
              })
            : JSON.stringify({
                  Prompt: message,
                  convId: this.conversationId,
                  lmName: "GPTModel",
              });

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            });
            const data = await response.json();
            this.hideLoader();
            if (this.firstMessage) {
                this.conversationId = data.data.conversationId;
                this.firstMessage = false;
            }
            return data.data.botMessage;
        } catch (error) {
            this.hideLoader();
            console.error("Error:", error);
            return 'Désolé, nous rencontrons un problème, veuillez contacter le service client au 04 71 09 15 53 ou <a href="https://nextsign.fr/#contact">ici</a>';
        }
    }

    private formatText(text: string): string {
        text = text.replace(/^######\s(.+)/gm, "<h6>$1</h6>");
        text = text.replace(/^#####\s(.+)/gm, "<h5>$1</h5>");
        text = text.replace(/^####\s(.+)/gm, "<h4>$1</h4>");
        text = text.replace(/^###\s(.+)/gm, "<h3>$1</h3>");
        text = text.replace(/^##\s(.+)/gm, "<h2>$1</h2>");
        text = text.replace(/^#\s(.+)/gm, "<h1>$1</h1>");

        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        text = text.replace(/__(.*?)__/g, "<strong>$1</strong>");

        text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
        text = text.replace(/_(.*?)_/g, "<em>$1</em>");

        text = text.replace(
            /\[(.*?)\]\((.*?)\)/g,
            '<a href="$2" target="_blank">$1</a>',
        );

        text = text.replace(/^\s*[-+*]\s+(.*)/gm, "<li>$1</li>");
        text = text.replace(/(<li>.*<\/li>)/gm, "<ul>$1</ul>");

        text = text.replace(/\n/g, "<br>");

        return text;
    }

    private handleUserMessage(): void {
        const message = this.userInput.value.trim();
        if (message) {
            this.displayUserMessage(message);
            this.userInput.value = "";
            this.chatbox.scrollTop = this.chatbox.scrollHeight;
            this.showLoader();
            this.generateResponse(message)
                .then((response) => this.formatText(response))
                .then((response) => this.displayBotMessage(response));
        }
    }

    private displayUserMessage(message: string): void {
        const userMessageElement = document.createElement("div");
        userMessageElement.className = "user";
        userMessageElement.classList.add("message", "user-message");
        userMessageElement.innerHTML = `<span class="message-text"><b>Vous:</b> ${message}</span>`;
        const dateTimeElement = document.createElement("div");
        dateTimeElement.className = "user-timestamp";
        dateTimeElement.innerHTML = `<span class="timestamp">${this.getCurrentTime()}</span>`;
        this.chatbox.appendChild(userMessageElement);
        this.chatbox.appendChild(dateTimeElement);
    }

    private displayBotMessage(message: string): void {
        const botMessageElement = document.createElement("div");
        botMessageElement.className = "bot";
        botMessageElement.classList.add("message", "bot-message");
        botMessageElement.innerHTML = `<span class="message-text"><b>Nextia:</b> ${message}</span>`;
        const dateTimeElement = document.createElement("div");
        dateTimeElement.className = "timestamp";
        dateTimeElement.innerHTML = `<span class="timestamp">${this.getCurrentTime()}</span>`;
        this.chatbox.appendChild(botMessageElement);
        this.chatbox.appendChild(dateTimeElement);
    }

    private sendWelcomeMessage(): void {
        const welcomeMessage =
            "Bonjour ! Je suis NextIA, votre assistant virtuel.";
        const botMessageElement = document.createElement("div");
        botMessageElement.classList.add("message", "bot-message");
        botMessageElement.innerHTML = `<span class="message-text"><b>Nextia:</b> ${welcomeMessage}</span>`;
        const dateTimeElement = document.createElement("div");
        dateTimeElement.className = "timestamp";
        dateTimeElement.innerHTML = `<span class="timestamp">${this.getCurrentTime()}</span>`;
        this.chatbox.appendChild(botMessageElement);
        this.chatbox.appendChild(dateTimeElement);
    }

    private showLoader(): void {
        this.userInput.disabled = true;
        this.loader.classList.remove("hidden");
        this.sendMessage.classList.add("hidden");
    }

    private hideLoader(): void {
        this.userInput.disabled = false;
        this.loader.classList.add("hidden");
        this.sendMessage.classList.remove("hidden");
    }
}

// Initialisation de l'instance de Chatbot une fois le DOM chargé
document.addEventListener("DOMContentLoaded", () => {
    const chatbot = new Chatbot();
});
