import React from "react";
type Props = {
  userInput: string;
};

const ChatBubbles: React.FC<Props> = ({ userInput }) => {
  return (
    <>
      <div className="relative w-full max-w-2xl mt-10">
        <div className="bg-[rgb(45,45,45)] text-white rounded-[1rem] absolute right-0 p-3">
          {userInput}
        </div>
      </div>
    </>
  );
};

export default ChatBubbles;
