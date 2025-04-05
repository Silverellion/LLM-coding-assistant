export default async function ollamaResponse(
  prompt: string,
  model: string = "qwen2.5-coder",
  stream: boolean = false
) {
  const ApiUrl = "http://localhost:11434/api/generate";
  const requestData = {
    model,
    prompt,
    stream,
  };
  try {
    const response = await fetch(ApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    const jsonResponse = await response.json();
    const rawResponse = jsonResponse.response ?? "No response,";
    return rawResponse;
  } catch {
    console.log("some shit went wrong :(");
    return null;
  }
}
