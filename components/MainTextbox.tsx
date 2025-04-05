import React from "react";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import iconAddWhite from "../assets/icons/add-white.svg";
import iconUpWhite from "../assets/icons/up-white.svg";

const MainTextbox: React.FC = () => {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleResize = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  const handleButtonUp = () => {
    setText("");
  };

  useEffect(() => {
    //#region adjust textbox height
    const textarea = textareaRef.current;
    const container = containerRef.current;
    if (textarea && container) {
      textarea.style.height = "auto";
      if (textarea.scrollHeight < 200) {
        textarea.style.height = `${textarea.scrollHeight}px`;
        container.style.height = `${textarea.scrollHeight + 40}px`;
      } else {
        textarea.style.height = `160px`;
        container.style.height = `200px`;
      }
    }
    //#endregion
    //#region handle submit text logic
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        setText("");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
    //#endregion
  }, [text]);

  return (
    <>
      <div className="relative w-full max-w-2xl mt-auto mb-10">
        <div
          ref={containerRef}
          className="relative w-full rounded-[1rem] bg-[rgb(45,45,45)]"
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleResize}
            className="
              w-full pt-2 px-5 resize-none overflow-y-auto 
              placeholder-[rgb(90,90,90)] text-white
              focus:outline-none focus:border-none
            "
            placeholder="Message"
          ></textarea>
          <button
            className="
                rounded-[10px] border border-[rgb(60,60,60)] cursor-pointer
                p-1 ml-4 bottom-2 left-0 absolute
                transition duration-300 hover:scale-120 hover:border-white
              "
          >
            <img src={iconAddWhite} alt="" />
          </button>
          <button
            className="
                rounded-[10px] border border-[rgb(60,60,60)] bg-[rgb(200,60,60)] cursor-pointer 
                p-1 mr-4 bottom-2 right-0 absolute 
                transition duration-300 hover:scale-120 hover:border-white
              "
            onClick={handleButtonUp}
          >
            <img src={iconUpWhite} alt="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MainTextbox;
