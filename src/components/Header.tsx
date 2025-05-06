import { CiExport } from "react-icons/ci";
import ExportModal from "./ExportModal";
import { useRef } from "react";

interface Props {
  pathConfig: {
    setup: Setup;
    cornerRadius: CornerRadius;
    invertedCorners: InvertedCorners;
    borderWidth: number;
    borderColor: string;
    backgroundColor: string;
  };
}

const Header = ({ pathConfig }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <header className="flex items-center justify-between p-4 pb-0">
        <a href="#" className="text-coffee">
          <img src="/logo.svg" width={40} height={40} />
        </a>
        <button
          onClick={() => modalRef.current?.showModal()}
          className="flex items-center gap-2 bg-frappe text-gray-50 hover:brightness-110 transition-all py-2 px-4 rounded-2xl"
        >
          <CiExport size={25} /> Export
        </button>
      </header>

      <ExportModal ref={modalRef} pathConfig={pathConfig} />
    </>
  );
};

export default Header;
