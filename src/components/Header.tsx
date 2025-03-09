import { CiExport } from "react-icons/ci";

const header = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <a href="#">Logo</a>
      <button className="flex items-center gap-2 bg-gray-200 py-2 px-4 rounded-2xl">
        <CiExport /> Export
      </button>
    </header>
  );
};

export default header;
