import React from "react";

type Props = {
  isSidebarCollasped: boolean;
};

const SavedChat: React.FC<Props> = ({ isSidebarCollasped }) => {
  return (
    <button
      className={`w-full p-2 mt-1 bg-[rgb(45,45,45)] text-white flex items-center rounded-[15px] 
        cursor-pointer hover:bg-[rgb(30,30,30)] hover:translate-x-3 transition-all duration-300 ease-out`}
    >
      {!isSidebarCollasped && <span>Saved Chat</span>}
    </button>
  );
};

export default SavedChat;
