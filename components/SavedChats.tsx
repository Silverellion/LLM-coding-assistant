import React from "react";

type Props = {
  isSidebarCollapsed: boolean;
};

const SavedChat: React.FC<Props> = ({ isSidebarCollapsed }) => {
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
      className={`w-full p-2 mt-1 bg-[rgb(45,45,45)] text-white flex items-center rounded-[15px] 
        cursor-pointer hover:bg-[rgb(30,30,30)] hover:translate-x-3 transition-all duration-300 ease-out`}
    >
      <span
        className={`transform transition-opacity duration-300 ease-out 
          ${isTextVisible ? "opacity-100" : "opacity-0"}`}
      >
        Saved Chat
      </span>
    </button>
  );
};

export default SavedChat;
