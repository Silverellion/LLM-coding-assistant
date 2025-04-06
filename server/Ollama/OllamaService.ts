import { OllamaMemoryManager } from "./OllamaMemoryManager";

export default async function OllamaResponse(
  prompt: string,
  memoryId: string,
  model: string = "qwen2.5-coder"
) {
  try {
    const chain = OllamaMemoryManager.getOrCreateChain(memoryId, model);

    const response = await chain.invoke({
      input: prompt,
    });

    return response.response;
  } catch (error) {
    console.error("Failed to fetch response:", error);
    return null;
  }
}
