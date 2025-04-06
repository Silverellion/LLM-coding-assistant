import React from "react";
import hljs from "highlight.js";
import "highlight.js/styles/felipec.css";
import ReactMarkdown from "react-markdown";

type Props = {
  inputMessage: string;
};

const CodeblockConverter: React.FC<Props> = ({ inputMessage }) => {
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match && match[1] ? match[1] : "";

      if (!inline && language) {
        try {
          const highlightedCode = hljs.highlight(
            String(children).replace(/\n$/, ""),
            { language }
          ).value;

          return (
            <pre>
              <code
                className={`hljs ${language}`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                {...props}
              />
            </pre>
          );
        } catch (err) {
          console.warn("Error highlighting code block:", err);
        }
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
