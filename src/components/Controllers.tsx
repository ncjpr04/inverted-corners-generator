import { useRef, useState } from "react";
import { gcd } from "../utils";
import { TbRectangle, TbRectangleVertical, TbSquare } from "react-icons/tb";

interface Props {
  setup: Setup;
  setSetup: React.Dispatch<React.SetStateAction<Setup>>;
}

const Controllers = ({ setup, setSetup }: Props) => {
  const [aspectRatio, setAspectRatio] = useState(
    gcd(setup.width, setup.height)
  );
  const formRef = useRef(null);

  const updateDimensions = (
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (!formRef.current) return;

    const data = new FormData(formRef.current);
    const width = +data.get("width")!;
    const height = +data.get("height")!;

    if (isNaN(width) || isNaN(height))
      return alert("Dimension values must be a number");

    if (setup.width === width && setup.height === height) return;

    setSetup({ width, height });
    setAspectRatio(gcd(width, height));
  };

  return (
    <div className="rounded-2xl shadow-[0_0_9px_rgb(0_0_0_/_.1)] md:h-[85vh] p-4">
      <div>
        <h2 className="mb-2">Dimensions:</h2>
        <div className="flex items-center gap-2">
          <form
            ref={formRef}
            className="flex items-center gap-4"
            onSubmit={updateDimensions}
          >
            <input
              type="number"
              name="width"
              aria-label="width"
              defaultValue={setup.width}
              onBlur={updateDimensions}
              className="border py-0.5 px-2 rounded-[5px] appearance-none w-[6ch]"
            />
            &times;
            <input
              name="height"
              type="number"
              aria-label="height"
              defaultValue={setup.height}
              onBlur={updateDimensions}
              className="border py-0.5 px-2 rounded-[5px] appearance-none w-[6ch]"
            />
            <button></button>
          </form>
          <p className="flex items-center gap-2">
            {setup.width / aspectRatio}:{setup.height / aspectRatio}
            {setup.width == setup.height ? (
              <TbSquare size={23} />
            ) : setup.width > setup.height ? (
              <TbRectangle size={23} />
            ) : (
              <TbRectangleVertical size={23} />
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Controllers;
