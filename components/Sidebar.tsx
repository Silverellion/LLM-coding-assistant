import React from "react";

type SidebarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full ${
        isCollapsed ? "w-[50px]" : "w-[300px]"
      } bg-[rgb(15,15,15)] transition-all duration-300`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-2 right-2 bg-[rgb(45,45,45)] text-white p-2 rounded"
      >
        {isCollapsed ? ">" : "<"}
      </button>
    </div>
  );
};

export default Sidebar;
