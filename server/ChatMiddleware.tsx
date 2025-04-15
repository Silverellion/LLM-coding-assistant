import { ChatManager, SavedChat, ChatMessage } from "./ChatManager";
import { OllamaMemoryManager } from "./Ollama/OllamaMemoryManager";

export class ChatMiddleware {
  private static instance: ChatMiddleware;
  private chatManager: ChatManager;

  private constructor() {
    this.chatManager = ChatManager.getInstance();
  }

  public static getInstance(): ChatMiddleware {
    if (!ChatMiddleware.instance) {
      ChatMiddleware.instance = new ChatMiddleware();
    }
    return ChatMiddleware.instance;
  }

  public getSavedChats(): SavedChat[] {
    return this.chatManager.getSavedChats();
  }

  public handleUserInput(
    text: string,
    currentMessages: ChatMessage[]
  ): {
    newMessages: ChatMessage[];
    savedChats: SavedChat[];
  } {
    const newUserMessage: ChatMessage = { text, isUser: true };
    const newMessages = [...currentMessages, newUserMessage];

    this.chatManager.addUserMessage(text);
    const savedChats = this.chatManager.getSavedChats();

    return { newMessages, savedChats };
  }

  public handleNewChat(): {
    newMessages: ChatMessage[];
    savedChats: SavedChat[];
  } {
    this.chatManager.createNewChat();
    const savedChats = this.chatManager.getSavedChats();

    return { newMessages: [], savedChats };
  }

  public handleLoadChat(chatId: string): {
    newMessages: ChatMessage[];
    savedChats: SavedChat[];
  } {
    const loadedChat = this.chatManager.loadChat(chatId);
    const savedChats = this.chatManager.getSavedChats();

    if (loadedChat) {
      return { newMessages: loadedChat.messages, savedChats };
    }
    return { newMessages: [], savedChats };
  }

  public handleRenameChat(
    chatId: string,
    newName: string
  ): {
    savedChats: SavedChat[];
  } {
    const savedChats = this.chatManager
      .getSavedChats()
      .map((chat) => (chat.id === chatId ? { ...chat, name: newName } : chat));

    this.chatManager.setSavedChats(savedChats);
    return { savedChats };
  }

  public handleDeleteChat(
    chatId: string,
    currentChatId: string | null
  ): {
    newMessages: ChatMessage[];
    savedChats: SavedChat[];
    isCurrentChat: boolean;
  } {
    const isCurrentChat = chatId === currentChatId;
    if (isCurrentChat) {
      OllamaMemoryManager.clearMemory(chatId);
    }
    this.deleteChat(chatId);
    const savedChats = this.chatManager.getSavedChats();

    if (isCurrentChat) {
      this.chatManager.createNewChat();
      return { newMessages: [], savedChats, isCurrentChat };
    }

    return { newMessages: [], savedChats, isCurrentChat };
  }

  public updateWithAIResponse(
    response: string,
    currentMessages: ChatMessage[]
  ): {
    newMessages: ChatMessage[];
    savedChats: SavedChat[];
  } {
    const aiMessage: ChatMessage = { text: response, isUser: false };
    const newMessages = [...currentMessages, aiMessage];

    this.chatManager.updateChatWithAIResponse(response);
    const savedChats = this.chatManager.getSavedChats();

    return { newMessages, savedChats };
  }

  private deleteChat(chatId: string): void {
    // Filter out the chat with the given ID
    const filteredChats = this.chatManager
      .getSavedChats()
      .filter((chat) => chat.id !== chatId);

    this.chatManager.setSavedChats(filteredChats);
  }

  public getCurrentChatId(): string | null {
    return this.chatManager.getCurrentChatId();
  }
}
