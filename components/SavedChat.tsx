import React from "react";

type Props = {
  isSidebarCollasped: boolean;
};

const SavedChat: React.FC<Props> = ({ isSidebarCollasped }) => {
  return (
    <>
      {!isSidebarCollasped && (
        <button
          className="
            w-full p-2 mt-1 bg-[rgb(45,45,45)] text-white flex items-center rounded-[15px] 
            transition-all duration-600 ease-out
        "
        >
          Saved Chat
        </button>
      )}
    </>
  );
};

export default SavedChat;
