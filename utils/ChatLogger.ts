import fs from "fs";
import path from "path";

const userMessages = new Map<string, string>();
const logsDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function cleanUserMessage(message: string): string {
  if (!message) return message;
  message = message.replace(/\\nAI:.*$/, "");
  message = message.replace(/"?\],"stream":true\}$/, "");
  message = message.replace(/"?\}].*$/, "");
  return message;
}

function extractUserMessage(body: string): string {
  const parsedBody = JSON.parse(body);
  let actualUserMessage = "";

  if (parsedBody.messages && parsedBody.messages.length > 0) {
    const lastMessage = parsedBody.messages[parsedBody.messages.length - 1];
    if (lastMessage.content) {
      actualUserMessage = lastMessage.content;
    } else if (lastMessage.kwargs && lastMessage.kwargs.content) {
      actualUserMessage = lastMessage.kwargs.content;
    }
  }

  const conversationRegex = /Current conversation:[^]*Human: ([^\n]+)/;
  const match = body.match(conversationRegex);
  if (match && match[1]) {
    actualUserMessage = match[1];
  }

  return cleanUserMessage(actualUserMessage);
}

export function configureLogging(proxy: any): void {
  proxy.on("proxyReq", (req: any) => {
    let body = "";
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const clientIP =
        req.headers["cf-connecting-ip"] ||
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "unknown";

      const userMessage = extractUserMessage(body);
      userMessages.set(clientIP, userMessage);
      userMessages.set(clientIP + "_raw", body);
    });
  });

  proxy.on("proxyRes", (proxyRes: any, req: any) => {
    const clientIP =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown";

    const responseChunks: string[] = [];
    let aiResponse = "";

    proxyRes.on("data", (chunk: Buffer) => {
      const chunkStr = chunk.toString();
      responseChunks.push(chunkStr);

      const jsonData = JSON.parse(chunkStr);
      if (jsonData.message?.content) {
        aiResponse += jsonData.message.content;
      }
    });

    proxyRes.on("end", () => {
      const userMessage = userMessages.get(clientIP) || "Unknown user message";

      if (!aiResponse) {
        const fullResponse = responseChunks.join("");
        fullResponse
          .split("\n")
          .filter((line) => line.trim())
          .forEach((line) => {
            const obj = JSON.parse(line);
            if (obj.message?.content) {
              aiResponse += obj.message.content;
            }
          });

        if (!aiResponse) {
          aiResponse = fullResponse.slice(0, 100) + "...";
        }
      }

      const timestamp = new Date().toISOString();
      const logEntry = `
==================================================
DATE: ${timestamp}
IP: ${clientIP}
Human: ${userMessage}
AI: ${aiResponse}
==================================================`;

      console.log(logEntry);

      const logFile = path.join(
        logsDir,
        `chat_log_${new Date().toISOString().replace(/[:.]/g, "-")}.txt`
      );
      fs.writeFileSync(logFile, logEntry);

      userMessages.delete(clientIP);
      userMessages.delete(clientIP + "_raw");
    });
  });
}
