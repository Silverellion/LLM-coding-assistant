import React from "react";
import OllamaResponse from "../server/Ollama/OllamaService";
import CodeblockConverter from "./CodeblockConverter";

type Props = {
  userInput: { dateSent: Date; text: string } | null;
};

type Message = {
  text: string;
  isUser: boolean;
};

const ChatBubbles: React.FC<Props> = ({ userInput }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [streamingResponse, setStreamingResponse] = React.useState<string>("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const getOllamaResponse = async (input: string) => {
    setIsGenerating(true);
    setStreamingResponse("");

    try {
      const finalResponse = await OllamaResponse(input, "testMemory", (text) =>
        setStreamingResponse(text)
      );

      setMessages((prev) => [
        ...prev,
        { text: finalResponse || "", isUser: false },
      ]);
    } catch (error) {
      console.log("Error getting Ollama response:", error);
    } finally {
      setIsGenerating(false);
      setStreamingResponse("");
    }
  };

  React.useEffect(() => {
    if (userInput && userInput.text) {
      setMessages((prev) => [...prev, { text: userInput.text, isUser: true }]);
      getOllamaResponse(userInput.text);
    }
  }, [userInput]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingResponse]);

  return (
    <>
      <div className="w-full overflow-y-auto flex mb-5">
        <div className="relative w-full max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${message.isUser ? "bg-[rgb(45,45,45)]" : ""} 
                  text-white rounded-[1rem] 
                  mt-5 p-3 max-w-full 
                  break-words whitespace-pre-wrap overflow-wrap-anywhere`}
              >
                <CodeblockConverter inputMessage={message.text} />
              </div>
            </div>
          ))}

          {isGenerating && streamingResponse && (
            <div className="flex justify-start">
              <div className="text-white rounded-[1rem] mt-5 p-3 max-w-full break-words whitespace-pre-wrap overflow-wrap-anywhere">
                <CodeblockConverter inputMessage={streamingResponse} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
};

export default ChatBubbles;
