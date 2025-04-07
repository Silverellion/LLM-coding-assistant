import { OllamaMemoryManager } from "./OllamaMemoryManager";

export default function OllamaResponse(
  prompt: string,
  memoryId: string,
  streamHandler: ((text: string) => void) | null = null,
  model: string = "qwen2.5-coder"
) {
  try {
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
