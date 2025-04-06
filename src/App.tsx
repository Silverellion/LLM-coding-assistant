import { useState } from "react";
import "../styles/global.css";
import ChatBubbles from "../components/ChatBubbles";
import MainTextbox from "../components/MainTextbox";

function App() {
  const [userInput, setUserInput] = useState<string>("");
  return (
    <>
      <div
        className="
        w-screen h-screen bg-[rgb(30,30,30)] 
        flex flex-col items-center justify-end 
      "
      >
        <ChatBubbles userInput={userInput} />
        <MainTextbox setUserInput={setUserInput} />
      </div>
    </>
  );
}

export default App;
