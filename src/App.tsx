import { useState, useEffect } from "react";
import "../global.css";
import ChatBubbles from "../components/ChatBubbles";
import MainTextbox from "../components/MainTextbox";
import Sidebar from "../components/Sidebar";
import { ChatMessage, SavedChat } from "../server/ChatManager";
import { ChatMiddleware } from "../server/ChatMiddleware";

function App() {
  const [userInput, setUserInput] = useState<{
    dateSent: Date;
    text: string;
  } | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const chatMiddleware = ChatMiddleware.getInstance();

  useEffect(() => {
    setSavedChats(chatMiddleware.getSavedChats());
    setCurrentChatId(chatMiddleware.getCurrentChatId());
  }, []);

  const handleUserInput = (text: string) => {
    const newUserInput = { dateSent: new Date(), text: text };
    setUserInput(newUserInput);

    const { newMessages, savedChats } = chatMiddleware.handleUserInput(
      text,
      messages
    );
    setMessages(newMessages);
    setSavedChats(savedChats);
    setCurrentChatId(chatMiddleware.getCurrentChatId());
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleNewChat = () => {
    const { newMessages, savedChats } = chatMiddleware.handleNewChat();
    setMessages(newMessages);
    setSavedChats(savedChats);
    setUserInput(null);
    setCurrentChatId(chatMiddleware.getCurrentChatId());
  };

  const handleLoadChat = (chatId: string) => {
    const { newMessages, savedChats } = chatMiddleware.handleLoadChat(chatId);
    setMessages(newMessages);
    setSavedChats(savedChats);
    setCurrentChatId(chatMiddleware.getCurrentChatId());
  };

  const handleDeleteChat = (chatId: string) => {
    const { newMessages, savedChats, isCurrentChat } =
      chatMiddleware.handleDeleteChat(chatId, currentChatId);
    setSavedChats(savedChats);
    if (isCurrentChat) {
      setMessages(newMessages);
      setUserInput(null);
      setCurrentChatId(chatMiddleware.getCurrentChatId());
    }
  };

  const handleRenameChat = (chatId: string, newName: string) => {
    const { savedChats } = chatMiddleware.handleRenameChat(chatId, newName);
    setSavedChats(savedChats);
  };

  // Update chat middleware and UI when AI responds
  const updateMessagesAndSavedChat: React.Dispatch<
    React.SetStateAction<ChatMessage[]>
  > = (newMessagesAction) => {
    const newMessages =
      typeof newMessagesAction === "function"
        ? newMessagesAction(messages)
        : newMessagesAction;

    setMessages(newMessages);

    // Find the AI response (the last message if it's from AI)
    const lastMessage = newMessages[newMessages.length - 1];
    if (lastMessage && !lastMessage.isUser) {
      const { savedChats } = chatMiddleware.updateWithAIResponse(
        lastMessage.text,
        newMessages
      );
      setSavedChats(savedChats);
      setCurrentChatId(chatMiddleware.getCurrentChatId());
    }
  };

  return (
    <div className="w-screen h-screen bg-[rgb(30,30,30)] flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        savedChats={savedChats}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      <div
        className={`flex flex-col items-center justify-end transition-all duration-300 w-full ${
          isSidebarCollapsed ? "ml-[50px]" : "ml-[300px]"
        }`}
      >
        <ChatBubbles
          userInput={userInput}
          messages={messages}
          setMessages={updateMessagesAndSavedChat}
        />
        <MainTextbox setUserInput={handleUserInput} />
      </div>
    </div>
  );
}

export default App;
