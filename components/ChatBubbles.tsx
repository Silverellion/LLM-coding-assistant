import React from "react";
type Props = {
  userInput: string;
};

const ChatBubbles: React.FC<Props> = ({ userInput }) => {
  const [messages, setMessages] = React.useState<String[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (userInput) {
      setMessages((prevMessages) => [...prevMessages, userInput]);
    }
  }, [userInput]);
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userInput]);
  return (
    <>
      <div className="w-full overflow-y-auto flex">
        <div className="relative w-full max-w-2xl mb-5 mx-auto">
          {messages.map((message, index) => (
            <div key={index} className="flex justify-end">
              <div
                className="
                bg-[rgb(45,45,45)] text-white rounded-[1rem]
                 mt-5 right-0 p-3 max-w-full 
                break-words whitespace-pre-wrap overflow-wrap-anywhere
                "
              >
                {message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
};

export default ChatBubbles;
