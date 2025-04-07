import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { ChatOllama } from "@langchain/ollama";

export class OllamaMemoryManager {
  private static memories: Map<string, BufferMemory> = new Map();
  private static chains: Map<string, ConversationChain> = new Map();
  private static baseUrl = "http://localhost:11434";

  static getOrCreateChain(memoryId: string, model: string): ConversationChain {
    if (!this.chains.has(memoryId)) {
      const memory = new BufferMemory({
        returnMessages: true,
        memoryKey: "history",
      });
      this.memories.set(memoryId, memory);

      const ollama = new ChatOllama({
        baseUrl: this.baseUrl,
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
