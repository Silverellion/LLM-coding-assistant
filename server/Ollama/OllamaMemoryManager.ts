import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { ChatOllama } from "@langchain/ollama";

export class OllamaMemoryManager {
  private static memories: Map<string, BufferMemory> = new Map();
  private static chains: Map<string, ConversationChain> = new Map();
  private static apiPrefix = import.meta.env.VITE_API_PREFIX || "/api/ollama";

  static getOrCreateChain(
    memoryId: string,
    model: string,
    customBaseUrl?: string
  ): ConversationChain {
    if (!this.chains.has(memoryId)) {
      const memory = new BufferMemory({
        returnMessages: true,
        memoryKey: "history",
      });
      this.memories.set(memoryId, memory);

      const baseUrl =
        customBaseUrl ||
        (typeof window !== "undefined"
          ? window.location.origin + this.apiPrefix
          : "http://localhost:5173" + this.apiPrefix);

      const ollama = new ChatOllama({
        baseUrl: baseUrl,
        model: model,
        streaming: true,
      });

      const chain = new ConversationChain({
        llm: ollama,
        memory: memory,
      });

      this.chains.set(memoryId, chain);
    }

    return this.chains.get(memoryId)!;
  }

  static clearMemory(memoryId: string): boolean {
    if (this.memories.has(memoryId)) {
      this.memories.delete(memoryId);
      this.chains.delete(memoryId);
      return true;
    }
    return false;
  }

  static clearAllMemories(): void {
    this.memories.clear();
    this.chains.clear();
  }
}
