import { useState } from "react";
import "../global.css";
import ChatBubbles from "../components/ChatBubbles";
import MainTextbox from "../components/MainTextbox";

function App() {
  const [userInput, setUserInput] = useState<{
    dateSent: Date;
    text: string;
  } | null>(null);
  const handleUserInput = (text: string) => {
    setUserInput({ dateSent: new Date(), text: text });
  };
  return (
    <>
      <div
        className="
        w-screen h-screen bg-[rgb(30,30,30)] 
        flex flex-col items-center justify-end 
      "
      >
        <ChatBubbles userInput={userInput} />
        <MainTextbox setUserInput={handleUserInput} />
      </div>
    </>
  );
}

export default App;
