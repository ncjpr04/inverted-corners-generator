import { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { MdOutlineContentCopy } from "react-icons/md";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-toastify";

interface Props {
  lang: string;
  code: string;
}

const CodeBlock = ({ code, lang }: Props) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Code Copied Successfully");
        setCopied(true);
      })
      .catch(() => toast.error("Error while writing to the clipboard"));

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="relative max-w-full overflow-auto">
      <div className="absolute text-bg w-full px-3 text-xs top-2 flex justify-between items-center">
        <span>{lang.toUpperCase()}</span>

        <button onClick={copyCode} className="flex items-center gap-1">
          {!copied ? (
            <>
              <MdOutlineContentCopy />
              copy
            </>
          ) : (
            <>
              <BiCheck />
              copied
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        style={vscDarkPlus}
        language={lang}
        customStyle={{ borderRadius: "8px", margin: 0, paddingTop: "2rem" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
