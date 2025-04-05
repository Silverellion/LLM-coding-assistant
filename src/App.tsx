import { useState } from "react";
import "../styles/main.css";
import ChatBubbles from "../components/ChatBubbles";
import MainTextbox from "../components/MainTextbox";

function App() {
  const [userInput, setUserInput] = useState<string>("");
  return (
    <>
      <div className="relative w-screen h-screen flex bg-cover bg-[rgb(30,30,30)] justify-center">
        <ChatBubbles userInput={userInput} />
        <MainTextbox setUserInput={setUserInput} />
      </div>
    </>
  );
}

export default App;
