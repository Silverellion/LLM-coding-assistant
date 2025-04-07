import React, { useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/felipec.css";
import ReactMarkdown from "react-markdown";

type Props = {
  inputMessage: string;
};

const CodeblockConverter: React.FC<Props> = ({ inputMessage }) => {
  const [copyMessage, setCopyMessage] = useState<string>("Copy");

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopyMessage("Copied");
    setTimeout(() => {
      setCopyMessage("Copy");
    }, 2000);
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
              className="absolute top-2 right-2 z-10 px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              {copyMessage}
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
