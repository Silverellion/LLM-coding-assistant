import React from "react";

type SidebarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div
      className={`fixed flex flex-row top-0 left-0 h-full ${
        isCollapsed ? "w-[50px]" : "w-[300px]"
      } bg-[rgb(15,15,15)] transition-all duration-300`}
    >
      <button
        onClick={toggleSidebar}
        className="
            absolute top-1/2 right-[-15px] transform -translate-y-1/2 
            bg-[rgb(45,45,45)] text-white p-2 rounded shadow-md cursor-pointer 
            hover:scale-120 hover:bg-[rgb(37,37,37)] transition-transform duration-300
        "
      >
        <span
          className={`
            inline-block transform transition-transform ease-in-out duration-600
            ${isCollapsed ? "rotate-0" : "rotate-540"}
        `}
        >
          &#10094;
        </span>
      </button>
    </div>
  );
};

export default Sidebar;
