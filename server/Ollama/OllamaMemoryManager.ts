import { Ollama } from "ollama";
import type { Message } from "ollama";

export class OllamaMemoryManager {
  private static conversations: Map<string, Message[]> = new Map();
  private static systemMessage = import.meta.env.VITE_OLLAMA_SYSTEM_MESSAGE;

  static async chat(
    memoryId: string,
    userMessage: string,
    model: string,
    customBaseUrl?: string,
    streamHandler?: (content: string) => void
  ): Promise<string> {
    if (!this.conversations.has(memoryId)) {
      this.conversations.set(memoryId, [
        { role: "system", content: this.systemMessage },
      ]);
    }

    const conversation = this.conversations.get(memoryId)!;
    conversation.push({ role: "user", content: userMessage });

    const client = customBaseUrl
      ? new Ollama({ host: customBaseUrl })
      : new Ollama();

    let fullResponse = "";

    if (streamHandler) {
      const response = await client.chat({
        model: model,
        messages: conversation,
        stream: true,
      });

      for await (const part of response) {
        fullResponse += part.message.content;
        streamHandler(fullResponse);
      }
    } else {
      const response = await client.chat({
        model: model,
        messages: conversation,
      });

      fullResponse = response.message.content;
    }

    conversation.push({ role: "assistant", content: fullResponse });
    return fullResponse;
  }

  static clearMemory(memoryId: string): boolean {
    if (this.conversations.has(memoryId)) {
      this.conversations.delete(memoryId);
      return true;
    }
    return false;
  }

  static clearAllMemories(): void {
    this.conversations.clear();
  }

  static getConversationHistory(memoryId: string): Message[] | null {
    return this.conversations.get(memoryId) || null;
  }

  static rebuildConversation(
    memoryId: string,
    messages: { text: string; isUser: boolean }[]
  ): void {
    const conversation: Message[] = [
      { role: "system", content: this.systemMessage },
    ];

    for (const msg of messages) {
      conversation.push({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      });
    }

    this.conversations.set(memoryId, conversation);
  }
}
