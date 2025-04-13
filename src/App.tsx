import { useState, useEffect } from "react";
import "../global.css";
import ChatBubbles from "../components/ChatBubbles";
import MainTextbox from "../components/MainTextbox";
import Sidebar from "../components/Sidebar";
import { ChatManager, SavedChat, ChatMessage } from "../server/ChatManager";

function App() {
  const [userInput, setUserInput] = useState<{
    dateSent: Date;
    text: string;
  } | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);

  // Initialize chat manager
  const chatManager = ChatManager.getInstance();

  useEffect(() => {
    setSavedChats(chatManager.getSavedChats());
  }, []);

  useEffect(() => {
    chatManager.setSavedChats(savedChats);
  }, [savedChats]);

  const handleUserInput = (text: string) => {
    const newUserInput = { dateSent: new Date(), text: text };
    setUserInput(newUserInput);

    // Add user message to messages array
    const newMessages = [...messages, { text, isUser: true }];
    setMessages(newMessages);
    chatManager.addUserMessage(text);
    setSavedChats([...chatManager.getSavedChats()]);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleNewChat = () => {
    console.log("Creating new chat");
    setMessages([]);
    setUserInput(null);
    chatManager.createNewChat();
  };

  const handleLoadChat = (chatId: string) => {
    const loadedChat = chatManager.loadChat(chatId);

    if (loadedChat) {
      // Update UI with loaded messages
      setMessages(loadedChat.messages);
    }
  };

  // Update chat manager and UI when AI responds
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
      chatManager.updateChatWithAIResponse(lastMessage.text);
      setSavedChats([...chatManager.getSavedChats()]);
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
