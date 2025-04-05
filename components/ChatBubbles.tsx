import React from "react";
type Props = {
  userInput: string;
};

const ChatBubbles: React.FC<Props> = ({ userInput }) => {
  const [messages, setMessages] = React.useState<String[]>([]);
  React.useEffect(() => {
    if (userInput) {
      setMessages((prevMessages) => [...prevMessages, userInput]);
    }
  }, [userInput]);
  return (
    <>
      <div className="relative w-full max-w-2xl mb-5">
        {messages.map((message, index) => (
          <div className="flex justify-end">
            <div
              key={index}
              className="bg-[rgb(45,45,45)] text-white rounded-[1rem] mt-5 right-0 p-3"
            >
              {message}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatBubbles;
