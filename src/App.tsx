import { useState, useEffect } from "react";
import { ChatManager, ChatMessage, SavedChat } from "../server/ChatManager";
import "../global.css";
import Sidebar from "../components/Sidebar";
import ChatBubbles from "../components/ChatBubbles";
import GreetingMessage from "../components/GrretingMessage";
import MainTextbox from "../components/MainTextbox";

function App() {
  const chatManager = ChatManager.getInstance();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>(
    chatManager.getSavedChats()
  );
  const [isChatStarted, setIsChatStarted] = useState(false);

  const [userInput, setUserInput] = useState<{
    dateSent: Date;
    text: string;
  } | null>(null);

  useEffect(() => {
    setSavedChats(chatManager.getSavedChats());
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setIsChatStarted(true);
    }
  }, [messages]);

  const syncState = (result: any) => {
    if (result.newMessages !== undefined) setMessages(result.newMessages);
    setSavedChats(result.savedChats);
  };

  const handleUserInput = (text: string) => {
    setUserInput({ dateSent: new Date(), text });
    setIsChatStarted(true);
    syncState(chatManager.handleUserInput(text, messages));
  };

  const handleNewChat = () => {
    syncState(chatManager.handleNewChat());
    setUserInput(null);
    setIsChatStarted(false);
  };

  const handleLoadChat = (chatId: string) => {
    syncState(chatManager.handleLoadChat(chatId));
    setIsChatStarted(true);
  };

  const handleDeleteChat = (chatId: string) => {
    const result = chatManager.handleDeleteChat(chatId);
    syncState(result);
    if (result.isCurrentChat) {
      setUserInput(null);
      setIsChatStarted(false);
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
        className={`flex flex-col transition-all duration-300 w-full ${
          isSidebarCollapsed ? "ml-[20px] mr-[20px]" : "md:ml-[300px] ml-[0px]"
        } ${
          isChatStarted
            ? "items-center justify-end"
            : "items-center justify-center"
        }`}
      >
        {!isChatStarted && <GreetingMessage />}

        <ChatBubbles
          userInput={userInput}
          messages={messages}
          onAIResponse={(response) => {
            if (response) {
              syncState(chatManager.updateWithAIResponse(response, messages));
            }
          }}
        />

        <div
          className={`w-full flex justify-center ${
            isChatStarted ? "mt-auto" : "mt-8"
          }`}
        >
          <MainTextbox setUserInput={handleUserInput} />
        </div>
      </div>
    </div>
  );
}

export default App;
