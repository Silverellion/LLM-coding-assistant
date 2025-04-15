import React from "react";
import IconDelete from "../assets/icons/delete.svg";

type Props = {
  isSidebarCollapsed: boolean;
  chatName: string;
  chatId: string;
  onClick: () => void;
  onDelete: (chatId: string) => void;
};

const SavedChat: React.FC<Props> = ({
  isSidebarCollapsed,
  chatName,
  chatId,
  onClick,
  onDelete,
}) => {
  const [isTextVisible, setIsTextVisible] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent button's onClick
    onDelete(chatId);
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full p-2 mt-2 bg-[rgb(45,45,45)] text-white flex items-center justify-between rounded-[15px] 
        cursor-pointer hover:bg-[rgb(30,30,30)] hover:scale-110 transition-all duration-300 ease-out relative`}
    >
      <span
        className={`transform transition-opacity duration-300 ease-out 
          ${isTextVisible ? "opacity-100" : "opacity-0"}`}
      >
        {chatName}
      </span>
      {isTextVisible && isHovered && (
        <span
          onClick={handleDeleteClick}
          className="cursor-pointer hover:scale-140 transition-all duration-300 ease-out"
        >
          <img src={IconDelete} />
        </span>
      )}
    </button>
  );
};

export default SavedChat;
