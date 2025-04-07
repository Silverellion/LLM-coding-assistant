import React from "react";
import iconAdd from "../assets/icons/add.svg";
import iconUp from "../assets/icons/up.svg";

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
    setUserInput(text);
    setText("");
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
      if (e.ctrlKey && e.key === "Enter") handleUserInput();
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
            <img src={iconAdd} alt="" />
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
            <img src={iconUp} alt="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MainTextbox;
