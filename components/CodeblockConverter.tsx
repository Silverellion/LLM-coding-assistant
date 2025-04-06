import React from "react";
import hljs from "highlight.js";
import "highlight.js/styles/felipec.css";

type Props = {
  inputMessage: string;
};

const CodeblockConverter: React.FC<Props> = ({ inputMessage }) => {
  const [message, setMessage] = React.useState<string>("");

  React.useEffect(() => {
    const processMessage = () => {
      const parts = inputMessage.split(/(```[\s\S]*?```)/g);
      const processedParts = parts.map((part) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // Extract the language and code
          const firstLineEnd = part.indexOf("\n");
          const language = part.substring(3, firstLineEnd).trim();
          const code = part.substring(firstLineEnd + 1, part.length - 3).trim();

          try {
            // Highlight the code if language is specified, otherwise use auto-detection
            const highlighted = language
              ? hljs.highlight(code, { language }).value
              : hljs.highlightAuto(code).value;

            return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
          } catch (error) {
            // If highlighting fails, return the plain code block
            return `<pre><code>${code}</code></pre>`;
          }
        }
        // Return non-code-block parts as is
        return part;
      });

      setMessage(processedParts.join(""));
    };
    processMessage();
  }, [inputMessage]);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </>
  );
};

export default CodeblockConverter;
