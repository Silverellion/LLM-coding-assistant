import { OllamaMemoryManager } from "./Ollama/OllamaMemoryManager";

export type SavedChat = {
  id: string;
  name: string;
  messages: ChatMessage[];
};

export type ChatMessage = {
  text: string;
  isUser: boolean;
};

export class ChatManager {
  private static instance: ChatManager;
  private currentChatId: string | null = null;
  private savedChats: SavedChat[] = [];
  private modelName: string = "qwen2.5-coder";

  private constructor() {}

  public static getInstance(): ChatManager {
    if (!ChatManager.instance) {
      ChatManager.instance = new ChatManager();
    }
    return ChatManager.instance;
  }

  public getCurrentChatId(): string | null {
    return this.currentChatId;
  }

  public getSavedChats(): SavedChat[] {
    return [...this.savedChats];
  }

  public setSavedChats(chats: SavedChat[]): void {
    this.savedChats = [...chats];
  }

  public createNewChat(): void {
    try {
      if (this.currentChatId) {
        OllamaMemoryManager.clearMemory(this.currentChatId);
      }
    } catch (error) {
      console.error("Error clearing memory:", error);
    } finally {
      this.currentChatId = null;
    }
  }

  public loadChat(chatId: string): SavedChat | null {
    const chatToLoad = this.savedChats.find((chat) => chat.id === chatId);

    if (chatToLoad) {
      try {
        // Clear memory for the current chat if it exists
        if (this.currentChatId) {
          OllamaMemoryManager.clearMemory(this.currentChatId);
        }
        // Update Ai's memory
        this.currentChatId = chatId;
        this.rebuildMemoryFromMessages(chatId, chatToLoad.messages);
      } catch (error) {
        console.error("Error loading chat:", error);
      }
      return chatToLoad;
    }
    return null;
  }

  public addUserMessage(text: string): string {
    // Create a new chat if this is the first message of a new chat
    if (!this.currentChatId) {
      const truncatedName = text.length > 30 ? text.slice(0, 30) + "..." : text;
      const newChatId = Date.now().toString();
      this.currentChatId = newChatId;

      const newChat: SavedChat = {
        id: newChatId,
        name: truncatedName,
        messages: [{ text, isUser: true }],
      };

      this.savedChats = [...this.savedChats, newChat];
      return newChatId;
    } else {
      // Update existing chat with the new message
      this.savedChats = this.savedChats.map((chat) =>
        chat.id === this.currentChatId
          ? { ...chat, messages: [...chat.messages, { text, isUser: true }] }
          : chat
      );
      return this.currentChatId;
    }
  }

  public updateChatWithAIResponse(response: string): void {
    if (this.currentChatId) {
      const aiMessage: ChatMessage = { text: response, isUser: false };
      this.savedChats = this.savedChats.map((chat) =>
        chat.id === this.currentChatId
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      );
    }
  }

  private rebuildMemoryFromMessages(
    chatId: string,
    messages: ChatMessage[]
  ): void {
    try {
      // Clear any existing memory for this chat ID
      OllamaMemoryManager.clearMemory(chatId);
      // Get the memory chain for this chat ID
      const chain = OllamaMemoryManager.getOrCreateChain(
        chatId,
        this.modelName
      );

      // Process message pairs sequentially
      this.processMessagePairs(chain, messages);
    } catch (error) {
      console.error("Error in rebuildMemoryFromMessages:", error);
    }
  }

  private processMessagePairs(chain: any, messages: ChatMessage[]): void {
    // Extract user-AI message pairs
    const messagePairs: { input: string; response: string }[] = [];

    for (let i = 0; i < messages.length - 1; i += 2) {
      const userMessage = messages[i];
      const aiMessage = messages[i + 1];

      if (userMessage && userMessage.isUser && aiMessage && !aiMessage.isUser) {
        messagePairs.push({
          input: userMessage.text,
          response: aiMessage.text,
        });
      }
    }

    // Process pairs in sequence
    if (messagePairs.length > 0) {
      (async () => {
        try {
          for (const pair of messagePairs) {
            await chain.memory.saveContext(
              { input: pair.input },
              { response: pair.response }
            );
          }
        } catch (error) {
          console.error("Error processing message pairs:", error);
        }
      })();
    }
  }
}
