import React from "react";

type Props = {
  isSidebarCollasped: boolean;
};

const SavedChat: React.FC<Props> = ({ isSidebarCollasped }) => {
  return (
    <>
      <button
        className={`${
          isSidebarCollasped ? "w-0 opacity-0" : "w-full opacity-100"
        }
            p-2 mt-1 bg-[rgb(45,45,45)] text-white flex items-center rounded-[15px] 
            transition-all duration-300 ease-out cursor-pointer 
            hover:bg-[rgb(30,30,30)] hover:scale-110`}
      >
        Saved Chat
      </button>
    </>
  );
};

export default SavedChat;
