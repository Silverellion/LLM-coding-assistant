import React from "react";
import SavedChat from "./SavedChats";
import NewChat from "./NewChat";

type SidebarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onNewChat: () => void;
  savedChats: { id: string; name: string }[];
  onLoadChat: (chatId: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  onNewChat,
  savedChats,
  onLoadChat,
}) => {
  return (
    <>
      <div
        className={`fixed flex flex-col top-0 left-0 h-full ${
          isCollapsed ? "w-[0px]" : "w-[300px]"
        } bg-[rgb(15,15,15)] transition-width duration-300 ease-out`}
      >
        <button
          onClick={toggleSidebar}
          className={`${isCollapsed ? "right-[-25px]" : "right-[-12px]"} 
          absolute top-1/2 transform -translate-y-1/2 
          bg-[rgb(200,60,60)] text-white p-2 rounded shadow-md cursor-pointer 
          hover:scale-110 hover:bg-[rgb(200,40,40)] transition-transform duration-300`}
        >
          <span
            className={`inline-block pb-1 text-[25px] 
          transform transition-transform duration-900 
          ${isCollapsed ? "rotate-0" : "rotate-900"}`}
          >
            &#10097;
          </span>
        </button>

        {!isCollapsed && (
          <div className="mt-2 mx-4 flex flex-col items-center">
            <NewChat isSidebarCollapsed={isCollapsed} onNewChat={onNewChat} />
            {savedChats.map((chat) => (
              <SavedChat
                key={chat.id}
                isSidebarCollapsed={isCollapsed}
                chatName={chat.name}
                onClick={() => onLoadChat(chat.id)}
              />
            ))}
          </div>
        )}
      </div>
      {isCollapsed && (
        <NewChat isSidebarCollapsed={isCollapsed} onNewChat={onNewChat} />
      )}
    </>
  );
};

export default Sidebar;
