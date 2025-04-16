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
    return this.savedChats;
  }

  public handleUserInput(text: string, currentMessages: ChatMessage[]) {
    this.addUserMessage(text);
    return {
      newMessages: [...currentMessages, { text, isUser: true }],
      savedChats: this.getSavedChats(),
    };
  }

  public handleNewChat() {
    this.createNewChat();
    return {
      newMessages: [],
      savedChats: this.getSavedChats(),
    };
  }

  public handleLoadChat(chatId: string) {
    const loadedChat = this.loadChat(chatId);
    return {
      newMessages: loadedChat?.messages || [],
      savedChats: this.getSavedChats(),
    };
  }

  public handleRenameChat(chatId: string, newName: string) {
    this.savedChats = this.savedChats.map((chat) =>
      chat.id === chatId ? { ...chat, name: newName } : chat
    );
    return { savedChats: this.getSavedChats() };
  }

  public handleDeleteChat(chatId: string) {
    const isCurrentChat = chatId === this.currentChatId;
    if (isCurrentChat) {
      OllamaMemoryManager.clearMemory(chatId);
      this.createNewChat();
    }
    this.savedChats = this.savedChats.filter((chat) => chat.id !== chatId);
    return {
      newMessages: [],
      savedChats: this.getSavedChats(),
      isCurrentChat,
    };
  }

  public updateWithAIResponse(
    response: string,
    currentMessages: ChatMessage[]
  ) {
    this.updateChatWithAIResponse(response);
    return {
      newMessages: [...currentMessages, { text: response, isUser: false }],
      savedChats: this.getSavedChats(),
    };
  }

  public setSavedChats(chats: SavedChat[]): void {
    this.savedChats = chats;
  }

  public createNewChat(): void {
    if (this.currentChatId) {
      try {
        OllamaMemoryManager.clearMemory(this.currentChatId);
      } catch (error) {
        console.error("Error clearing memory:", error);
      }
    }
    this.currentChatId = null;
  }

  public loadChat(chatId: string): SavedChat | null {
    const chatToLoad = this.savedChats.find((chat) => chat.id === chatId);
    if (!chatToLoad) return null;
    if (this.currentChatId) {
      OllamaMemoryManager.clearMemory(this.currentChatId);
    }
    this.currentChatId = chatId;
    this.rebuildMemoryFromMessages(chatId, chatToLoad.messages);
    return chatToLoad;
  }

  public addUserMessage(text: string): string {
    if (!this.currentChatId) {
      const newChatId = Date.now().toString();
      this.currentChatId = newChatId;
      this.savedChats.push({
        id: newChatId,
        name: text,
        messages: [{ text, isUser: true }],
      });
      return newChatId;
    }
    this.savedChats = this.savedChats.map((chat) =>
      chat.id === this.currentChatId
        ? { ...chat, messages: [...chat.messages, { text, isUser: true }] }
        : chat
    );
    return this.currentChatId;
  }

  public updateChatWithAIResponse(response: string): void {
    if (this.currentChatId) {
      this.savedChats = this.savedChats.map((chat) =>
        chat.id === this.currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, { text: response, isUser: false }],
            }
          : chat
      );
    }
  }

  private rebuildMemoryFromMessages(
    chatId: string,
    messages: ChatMessage[]
  ): void {
    OllamaMemoryManager.clearMemory(chatId);
    OllamaMemoryManager.rebuildConversation(chatId, messages);
  }
}
