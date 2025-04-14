import { OllamaMemoryManager } from "./OllamaMemoryManager";
import { ChatManager } from "../ChatManager";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin + "/api/ollama"
    : "http://localhost:5173" + "/api/ollama";

export default async function OllamaResponse(
  prompt: string,
  streamHandler: ((text: string) => void) | null = null,
  model: string = "qwen2.5-coder"
) {
  const chatManager = ChatManager.getInstance();
  const memoryId = chatManager.getCurrentChatId() || "temp-" + Date.now();

  const chain = OllamaMemoryManager.getOrCreateChain(memoryId, model, baseUrl);
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
    .then((response) => {
      return response.response;
    });
}
