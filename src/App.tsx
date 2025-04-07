import { useState } from "react";
import "../global.css";
import ChatBubbles from "../components/ChatBubbles";
import MainTextbox from "../components/MainTextbox";
import Sidebar from "../components/Sidebar";

function App() {
  const [userInput, setUserInput] = useState<{
    dateSent: Date;
    text: string;
  } | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleUserInput = (text: string) => {
    setUserInput({ dateSent: new Date(), text: text });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="w-screen h-screen bg-[rgb(30,30,30)] flex">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`flex flex-col items-center justify-end transition-all duration-300 w-full ${
          isSidebarCollapsed ? "ml-[50px]" : "ml-[300px]"
        }`}
      >
        <ChatBubbles userInput={userInput} />
        <MainTextbox setUserInput={handleUserInput} />
      </div>
    </div>
  );
}

export default App;
