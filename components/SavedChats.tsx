import React from "react";

type Props = {
  isSidebarCollapsed: boolean;
  chatName: string;
  onClick: () => void;
};

const SavedChat: React.FC<Props> = ({
  isSidebarCollapsed,
  chatName,
  onClick,
}) => {
  const [isTextVisible, setIsTextVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isSidebarCollapsed) {
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
      onClick={onClick}
      className={`w-full p-2 mt-2 bg-[rgb(45,45,45)] text-white flex items-center rounded-[15px] 
        cursor-pointer hover:bg-[rgb(30,30,30)] hover:scale-110 transition-all duration-300 ease-out`}
    >
      <span
        className={`transform transition-opacity duration-300 ease-out 
          ${isTextVisible ? "opacity-100" : "opacity-0"}`}
      >
        {chatName}
      </span>
    </button>
  );
};

export default SavedChat;
