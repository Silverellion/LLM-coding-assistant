import React, { useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/felipec.css";
import ReactMarkdown from "react-markdown";
import iconCopy from "../assets/icons/copy.svg";
import iconChecked from "../assets/icons/checked.svg";

type Props = {
  inputMessage: string;
};

const CodeblockConverter: React.FC<Props> = ({ inputMessage }) => {
  const [copyText, setCopyText] = useState<string>("Copy");
  const [copyIcon, setCopyIcon] = useState<string>(iconCopy);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopyText("Copied");
    setCopyIcon(iconChecked);
    setTimeout(() => {
      setCopyText("Copy");
      setCopyIcon(iconCopy);
    }, 5000);
  };

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match && match[1] ? match[1] : "";

      if (!inline && language) {
        const code = String(children).replace(/\n$/, "");
        const highlightedCode = hljs.highlight(code, { language }).value;

        return (
          <div className="relative">
            <button
              onClick={() => handleCopy(code)}
              className="
                absolute top-2 right-2 z-10 px-2 py-1 
                bg-[rgb(60,60,60)] text-white rounded cursor-pointer
                transition duration-300 flex items-center gap-2
                hover:scale-120 hover:bg-[rgb(45,45,45)]
              "
            >
              <img src={copyIcon} alt="" className="w-4 h-4" />
              {copyText}
            </button>
            <pre>
              <code
                className={`hljs ${language}`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                {...props}
              />
            </pre>
          </div>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return <ReactMarkdown components={components}>{inputMessage}</ReactMarkdown>;
};

export default CodeblockConverter;
