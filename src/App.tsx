import { useState, useEffect } from "react";
import "../global.css";
import ChatBubbles from "../components/ChatBubbles";
import MainTextbox from "../components/MainTextbox";
import Sidebar from "../components/Sidebar";
import { ChatManager, ChatMessage, SavedChat } from "../server/ChatManager";

function App() {
  const chatManager = ChatManager.getInstance();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>(
    chatManager.getSavedChats()
  );

  const [userInput, setUserInput] = useState<{
    dateSent: Date;
    text: string;
  } | null>(null);

  useEffect(() => {
    setSavedChats(chatManager.getSavedChats());
  }, []);

  const syncState = (result: any) => {
    if (result.newMessages !== undefined) setMessages(result.newMessages);
    setSavedChats(result.savedChats);
  };

  const handleUserInput = (text: string) => {
    setUserInput({ dateSent: new Date(), text });
    syncState(chatManager.handleUserInput(text, messages));
  };

  const handleNewChat = () => {
    syncState(chatManager.handleNewChat());
    setUserInput(null);
  };

  const handleLoadChat = (chatId: string) => {
    syncState(chatManager.handleLoadChat(chatId));
  };

  const handleDeleteChat = (chatId: string) => {
    const result = chatManager.handleDeleteChat(chatId);
    syncState(result);
    if (result.isCurrentChat) {
      setUserInput(null);
    }
  };

  const handleRenameChat = (chatId: string, newName: string) => {
    syncState(chatManager.handleRenameChat(chatId, newName));
  };

  return (
    <div className="w-screen h-screen bg-[rgb(30,30,30)] flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        savedChats={savedChats}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      <div
        className={`flex flex-col items-center justify-end transition-all duration-300 w-full ${
          isSidebarCollapsed ? "ml-[20px] mr-[20px]" : "md:ml-[300px] ml-[0px]"
        }`}
      >
        <ChatBubbles
          userInput={userInput}
          messages={messages}
          onAIResponse={(response) => {
            if (response) {
              syncState(chatManager.updateWithAIResponse(response, messages));
            }
          }}
        />
        <MainTextbox setUserInput={handleUserInput} />
      </div>
    </div>
  );
}

export default App;
