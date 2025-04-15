import React from "react";
import IconAdd from "../assets/icons/add.svg";
import IconUp from "../assets/icons/up.svg";

type Props = {
  setUserInput: (value: string) => void;
};

const MainTextbox: React.FC<Props> = ({ setUserInput }) => {
  const [text, setText] = React.useState<string>("");
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleUserInput = () => {
    if (text.trim() !== "") {
      setUserInput(text);
      setText("");
    }
  };

  React.useEffect(() => {
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
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Prevents adding a new line
        handleUserInput();
      } else if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault(); // Prevents submitting the text
        const textarea = textareaRef.current;
        if (textarea) {
          const cursorPosition = textarea.selectionStart;
          const textBefore = text.slice(0, cursorPosition);
          const textAfter = text.slice(cursorPosition);
          setText(`${textBefore}\n${textAfter}`);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              cursorPosition + 1;
          }, 0);
        }
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
      <div className="relative w-full max-w-3xl mt-auto mb-10">
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
              scrollbar-track-teal-599
            "
            placeholder="Message"
          ></textarea>
          <button
            className="
                rounded-[10px] border border-[rgb(60,60,60)] cursor-pointer
                p-1 ml-4 bottom-2 left-0 absolute
                transition duration-300 
                hover:scale-120 hover:border-white
              "
          >
            <img src={IconAdd} alt="" />
          </button>
          <button
            className="
                rounded-[10px] border border-[rgb(60,60,60)] bg-[rgb(200,60,60)] cursor-pointer 
                p-1 mr-4 bottom-2 right-0 absolute 
                transition duration-300 
                hover:scale-120 hover:border-white hover:bg-[rgb(200,40,40)]
              "
            onClick={handleUserInput}
          >
            <img src={IconUp} alt="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MainTextbox;
