import React from "react";
import IconAdd from "../assets/icons/add.svg";

type Props = {
  isSidebarCollapsed: boolean;
};

const NewChat: React.FC<Props> = ({ isSidebarCollapsed }) => {
  const [isTextVisible, setIsTextVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isSidebarCollapsed) {
      // Wait for the sidebar's animation to finish before showing the text
      const timeout = setTimeout(() => {
        setIsTextVisible(true);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setIsTextVisible(false);
    }
  }, [isSidebarCollapsed]);

  return (
    <button
      className={`${
        isSidebarCollapsed
          ? "w-12 h-12 fixed bottom-4 right-4 rounded-full justify-center"
          : "w-full p-2 mt-1 rounded-full"
      } 
        bg-[rgb(200,60,60)] text-white flex items-center 
        cursor-pointer hover:bg-[rgb(200,40,40)] transition-all duration-300 ease-out
        ${isSidebarCollapsed ? "hover:scale-110" : "hover:translate-x-3"}`}
    >
      {isSidebarCollapsed ? (
        <span className="text-2xl">+</span>
      ) : (
        <span
          className={`transform transition-opacity duration-300 ease-out 
            ${isTextVisible ? "opacity-100" : "opacity-0"}`}
        >
          New Chat
        </span>
      )}
    </button>
  );
};

export default NewChat;
