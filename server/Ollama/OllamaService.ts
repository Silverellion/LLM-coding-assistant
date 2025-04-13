import { OllamaMemoryManager } from "./OllamaMemoryManager";
import { ChatManager } from "../ChatManager";

export default function OllamaResponse(
  prompt: string,
  streamHandler: ((text: string) => void) | null = null,
  model: string = "qwen2.5-coder"
) {
  try {
    // Get the current chat ID from the chat manager
    const chatManager = ChatManager.getInstance();
    const memoryId = chatManager.getCurrentChatId() || "temp-" + Date.now();

    const chain = OllamaMemoryManager.getOrCreateChain(memoryId, model);
    let fullResponse = "";

    return chain
      .call({
        input: prompt,
        callbacks: [
          {
            handleLLMNewToken(token: string) {
              fullResponse += token;
              if (streamHandler) streamHandler(fullResponse);
            },
          },
        ],
      })
      .then((response) => response.response);
  } catch (error) {
    console.error("Failed to fetch response:", error);
    return null;
  }
}
