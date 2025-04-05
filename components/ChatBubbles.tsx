import React from "react";
type Props = {
  userInput: string;
};

const ChatBubbles: React.FC<Props> = ({ userInput }) => {
  return (
    <>
      <div className="text-white">{userInput}</div>
    </>
  );
};

export default ChatBubbles;
