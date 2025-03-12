import { useEffect, useRef } from "react";
import { BsDownload } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { MdOutlineContentCopy } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";

interface Props {
  path: string;
  setup: Setup;
  ref: React.RefObject<HTMLDialogElement | null>;
}

const ExportModal = ({ path, setup, ref }: Props) => {
  const svgCode = useRef("");
  const clipPathCode = useRef("");

  useEffect(() => {
    svgCode.current = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${setup.width} ${setup.height}" width="${setup.width}" height="${setup.height}"><path d="${path}" /></svg>`;
    clipPathCode.current = `clip-path: path("${path}");`;
  }, [path]);

  const downloadSVG = () => {
    const blob = new Blob(
      [`<?xml version="1.0" encoding="UTF-8"?>${svgCode.current}`],
      { type: "image/svg+xml" }
    );
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "path-douiri.org.svg";
    a.click();
  };

  const copySVG = () => {
    navigator.clipboard
      .writeText(svgCode.current)
      .then(() => toast.success("SVG copied successfully"))
      .catch(() => toast.error("Error while writing to the clipboard"));
  };

  const copyClipPath = () => {
    navigator.clipboard
      .writeText(clipPathCode.current)
      .then(() => toast.success("ClipPath copied successfully"))
      .catch(() => toast.error("Error while writing to the clipboard"));
  };

  const copyMask = () => {
    const encodedSVG = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${setup.width} ${setup.height}"><path d="${path}" fill="#fff" /></svg>`
    );
    const maskCode = `-webkit-mask: url('data:image/svg+xml,${encodedSVG}') no-repeat center / contain;
          mask: url('data:image/svg+xml,${encodedSVG}') no-repeat center / contain;`;

    navigator.clipboard
      .writeText(maskCode)
      .then(() => toast.success("Mask copied successfully"))
      .catch(() => toast.error("Error writing to the clipboard"));
  };

  return (
    <>
      <dialog
        ref={ref}
        className="@container fixed w-xl left-1/2 top-1/2 -translate-1/2 p-5 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl">Export your Work</h2>
          <button
            onClick={() => ref.current?.close()}
            className="p-2 rounded-full bg-bg"
          >
            <IoClose />
          </button>
        </div>

        <div className="grid gap-3">
          <button
            onClick={copyMask}
            className="flex items-center gap-2 border border-gray-300 transition-all hover:brightness-90 justify-center rounded-md px-3 py-2"
          >
            <MdOutlineContentCopy /> Copy CSS Mask
          </button>
          <button
            onClick={copySVG}
            className="flex items-center gap-2 border border-gray-300 transition-all hover:brightness-90 justify-center rounded-md px-3 py-2"
          >
            <MdOutlineContentCopy /> Copy SVG
          </button>
          <button
            onClick={copyClipPath}
            className="flex items-center gap-2 border border-gray-300 transition-all hover:brightness-90 justify-center rounded-md px-3 py-2"
          >
            <MdOutlineContentCopy />
            Copy clip-path
          </button>
          <button
            className="flex items-center gap-2 bg-green text-white border transition-all border-gray-200 hover:brightness-110 justify-center rounded-md px-3 py-2"
            onClick={downloadSVG}
          >
            <BsDownload />
            Download
          </button>
        </div>
      </dialog>
      <ToastContainer theme="dark" autoClose={1000} position="top-center" />
    </>
  );
};

export default ExportModal;
