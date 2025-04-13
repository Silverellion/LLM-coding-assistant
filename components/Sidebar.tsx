import React from "react";
import SavedChat from "./SavedChat";
import iconAdd from "../assets/icons/add.svg";

type SidebarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <>
      <div
        className={`fixed flex flex-col top-0 left-0 h-full ${
          isCollapsed ? "w-[50px]" : "w-[300px]"
        } bg-[rgb(15,15,15)] transition-all duration-600`}
      >
        <button
          onClick={toggleSidebar}
          className="
          absolute top-1/2 right-[-10px] transform -translate-y-1/2 
          bg-[rgb(45,45,45)] text-white p-2 rounded shadow-md cursor-pointer 
          hover:scale-110 hover:bg-[rgb(37,37,37)] transition-transform duration-300
        "
        >
          <span
            className={`
            inline-block transform transition-transform ease-in-out duration-600
            ${isCollapsed ? "rotate-0" : "rotate-180"}
          `}
          >
            &#10095;
          </span>
        </button>

        <div
          className={`mt-2 ${isCollapsed ? "mx-0" : "mx-4"} 
          flex-col items-center transition-all duration-300 ease-out`}
        >
          <button
            className={`
             p-2 flex bg-[rgb(200,60,60)] text-white cursor-pointer 
            ${isCollapsed ? "rounded-full" : "w-full rounded-[15px]"}
            transition-all duration-300 ease-out
            hover:bg-[rgb(200,40,40)] 
            ${isCollapsed ? "hover:scale-120" : "hover:translate-x-3"} 
          `}
          >
            {isCollapsed ? <img src={iconAdd} /> : "New Chat"}
          </button>
          <SavedChat isSidebarCollasped={isCollapsed} />
          <SavedChat isSidebarCollasped={isCollapsed} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
