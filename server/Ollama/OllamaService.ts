import { OllamaMemoryManager } from "./OllamaMemoryManager";
import { ChatManager } from "../ChatManager";

const apiPrefix = import.meta.env.VITE_API_PREFIX || "/api/ollama";

// During development, use localhost. In production, it will use the current origin
const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin + apiPrefix
    : "http://localhost:5173" + apiPrefix;

console.log("OllamaService initialized with baseUrl:", baseUrl);

export default async function OllamaResponse(
  prompt: string,
  streamHandler: ((text: string) => void) | null = null,
  model: string = "qwen2.5-coder"
) {
  console.log("OllamaResponse called with model:", model);

  try {
    const chatManager = ChatManager.getInstance();
    const memoryId = chatManager.getCurrentChatId() || "temp-" + Date.now();
    console.log("Using memory ID:", memoryId);

    const chain = OllamaMemoryManager.getOrCreateChain(
      memoryId,
      model,
      baseUrl
    );
    let fullResponse = "";

    if (!chain) {
      throw new Error("Failed to create conversation chain");
    }

    console.log("Sending prompt to Ollama:", prompt.substring(0, 50) + "...");

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
        console.log("Received response from Ollama");
        return response.response;
      });
  } catch (error) {
    console.error("Failed to fetch response:", error);
    streamHandler?.(
      "Error: Could not connect to Ollama. Please check if the server is running."
    );
    return "Error: Could not connect to Ollama. Please check if the server is running.";
  }
}
