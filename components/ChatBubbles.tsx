import React from "react";
import ollamaResponse from "../server/ollamaClient.ts";

type Props = {
  userInput: string;
};

type Message = {
  text: string;
  isUser: boolean;
};

const ChatBubbles: React.FC<Props> = ({ userInput }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [generatingText, setGeneratingText] = React.useState<string>("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isGenerating) return;
    const animationCycle = [
      "Generating",
      "Generating.",
      "Generating..",
      "Generating...",
    ];
    let currentCycle = 0;
    const interval = setInterval(() => {
      currentCycle = (currentCycle + 1) % animationCycle.length;
      setGeneratingText(animationCycle[currentCycle]);
    }, 200);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const getOllamaResponse = async (input: string) => {
    setIsGenerating(true);
    try {
      const response = await ollamaResponse(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, isUser: false },
      ]);
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    if (userInput) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userInput, isUser: true },
      ]);
      getOllamaResponse(userInput);
    }
  }, [userInput]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  return (
    <>
      <div className="w-full overflow-y-auto flex mb-5">
        <div className="relative w-full max-w-2xl mx-auto">
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
                {message.text}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="text-[rgb(90,90,90)] mt-5 p-3">
                {generatingText}
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
