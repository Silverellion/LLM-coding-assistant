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

  if (parsedBody.userMessage) {
    actualUserMessage = parsedBody.userMessage;
  } else if (parsedBody.prompt) {
    actualUserMessage = parsedBody.prompt;
  } else if (parsedBody.messages && Array.isArray(parsedBody.messages)) {
    for (let i = parsedBody.messages.length - 1; i >= 0; i--) {
      const message = parsedBody.messages[i];
      if (message.role === "user" && message.content) {
        actualUserMessage = message.content;
        break;
      }
    }
  }

  if (!actualUserMessage) {
    const conversationRegex = /Current conversation:[^]*Human: ([^\n]+)/;
    const match = body.match(conversationRegex);
    if (match && match[1]) {
      actualUserMessage = match[1];
    }
  }

  const cleaned = cleanUserMessage(actualUserMessage);
  return cleaned || "Empty message";
}

export function configureLogging(proxy: any): void {
  proxy.on("proxyReq", (proxyReq: any, req: any) => {
    const originalWrite = proxyReq.write;
    proxyReq.write = function (data: any) {
      if (data) {
        const body = data.toString();
        const clientIP =
          req.headers["cf-connecting-ip"] ||
          req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress ||
          "unknown";

        const userMessage = extractUserMessage(body);
        const requestId = clientIP + "_" + Date.now();
        userMessages.set(requestId, userMessage);
        req.requestId = requestId;
      }

      return originalWrite.apply(proxyReq, arguments);
    };
  });

  proxy.on("proxyRes", (proxyRes: any, req: any) => {
    const clientIP =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown";

    const requestId = req.requestId || clientIP + "_unknown";
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
      const userMessage = userMessages.get(requestId) || "Unknown user message";

      if (!aiResponse) {
        const fullResponse = responseChunks.join("");
        const jsonData = JSON.parse(fullResponse);
        if (jsonData.message?.content) {
          aiResponse = jsonData.message.content;
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

      userMessages.delete(requestId);
    });
  });
}
