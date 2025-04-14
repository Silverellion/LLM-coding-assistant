import React from "react";
import OllamaResponse from "../server/Ollama/OllamaService";
import CodeblockConverter from "./CodeblockConverter";
import { ChatMessage } from "../server/ChatManager";
import LoadingAnimation from "./LoadingAnimation";

type Props = {
  userInput: { dateSent: Date; text: string } | null;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};

const ChatBubbles: React.FC<Props> = ({ userInput, messages, setMessages }) => {
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [streamingResponse, setStreamingResponse] = React.useState<string>("");
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const getOllamaResponse = async (input: string) => {
    setIsGenerating(true);
    setStreamingResponse("");

    try {
      const finalResponse = await OllamaResponse(input, (text) =>
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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  React.useEffect(() => {
    if (userInput && userInput.text) {
      getOllamaResponse(userInput.text);
      scrollToBottom();
    }
  }, [userInput]);

  return (
    <>
      <div className="w-full overflow-y-auto flex mb-5" ref={chatContainerRef}>
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

          {isGenerating && !streamingResponse && (
            <div className="flex justify-start">
              <div className="text-[rgb(90,90,90)] rounded-[1rem] mt-5 p-3 max-w-full break-words whitespace-pre-wrap overflow-wrap-anywhere">
                <LoadingAnimation />
              </div>
            </div>
          )}

          {isGenerating && streamingResponse && (
            <div className="flex justify-start">
              <div className="text-white rounded-[1rem] mt-5 p-3 max-w-full break-words whitespace-pre-wrap overflow-wrap-anywhere">
                <CodeblockConverter inputMessage={streamingResponse} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatBubbles;
