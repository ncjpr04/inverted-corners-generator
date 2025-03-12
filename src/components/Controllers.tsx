import { useRef, useState } from "react";
import { constraint, gcd } from "../utils";
import {
  TbBorderCorners,
  TbRectangle,
  TbRectangleVertical,
  TbSquare,
} from "react-icons/tb";
import {
  RxCornerBottomLeft,
  RxCornerBottomRight,
  RxCornerTopLeft,
  RxCornerTopRight,
} from "react-icons/rx";
import InvertedTopRightCorner from "../assets/InvertedTopRightCorner";

interface Props {
  setup: Setup;
  setSetup: React.Dispatch<React.SetStateAction<Setup>>;
  cornerRadius: CornerRadius;
  setCornerRadius: React.Dispatch<React.SetStateAction<CornerRadius>>;
  invertedCorners: InvertedCorners;
  setInvertedCorners: React.Dispatch<React.SetStateAction<InvertedCorners>>;
}
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactElement;
}

const Input = ({ icon, ...rest }: InputProps) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </div>
      )}
      <input
        {...rest}
        type="number"
        step="any"
        min="0"
        className={`${
          icon ? "pl-6" : ""
        } border py-0.5 px-2 rounded-[5px] appearance-none w-full`}
      />
    </div>
  );
};

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactElement;
}
const CheckBox = ({ icon, children, ...rest }: CheckBoxProps) => (
  <label className="border flex text-sm gap-2 items-center cursor-pointer has-checked:bg-frappe p-2 rounded-md">
    {icon} {children}
    <input type="checkbox" {...rest} className="sr-only" />
  </label>
);

const Controllers = ({
  setup,
  setSetup,
  setCornerRadius,
  cornerRadius,
  invertedCorners,
  setInvertedCorners,
}: Props) => {
  const [aspectRatio, setAspectRatio] = useState(
    gcd(setup.width, setup.height)
  );
  const dimensionsFormRef = useRef(null);
  const cornerRadiusFormRef = useRef(null);

  const updateDimensions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dimensionsFormRef.current) return;

    const data = new FormData(dimensionsFormRef.current);
    const width = +data.get("width")!;
    const height = +data.get("height")!;

    if (isNaN(width) || isNaN(height))
      return alert("Dimension values must be a number");

    if (setup.width === width && setup.height === height) return;

    updateCornerRadius({ width, height });
    setSetup({ width, height });
    setAspectRatio(gcd(width, height));
  };

  const updateCornerRadius = (setup: Setup) => {
    if (!cornerRadiusFormRef.current) return;
    const formData = new FormData(cornerRadiusFormRef.current);
    const r = constraint(setup, +formData.get("radius")!);
    setCornerRadius({ tl: r, tr: r, br: r, bl: r });
  };

  const getCornerRadiusValue = () => {
    if (
      cornerRadius.bl === cornerRadius.br &&
      cornerRadius.br === cornerRadius.tl &&
      cornerRadius.tl === cornerRadius.tr
    )
      return cornerRadius.bl;
    return "";
  };

  const updateSpecificCornerRadius = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCornerRadius((prev) => ({
      ...prev,
      [e.target.name]: constraint(setup, +e.target.value),
    }));
  };

  const toggleInversion = (corner: keyof InvertedCorners) => {
    setInvertedCorners((prev) => ({
      ...prev,
      [corner]: { ...prev[corner], inverted: !prev[corner].inverted },
    }));
  };

  return (
    <div className="rounded-2xl flex flex-col gap-4 shadow-[0_0_9px_rgb(0_0_0_/_.1)] md:h-[85vh] p-4">
      <div>
        <h2 className="mb-2">Dimensions:</h2>
        <div className="flex items-center gap-2">
          <form
            ref={dimensionsFormRef}
            className="flex items-center gap-3"
            onSubmit={updateDimensions}
          >
            <Input
              icon={<span>W</span>}
              name="width"
              aria-label="width"
              defaultValue={setup.width}
              onBlur={updateDimensions}
            />
            &times;
            <Input
              icon={<span>H</span>}
              name="height"
              aria-label="height"
              defaultValue={setup.height}
              onBlur={updateDimensions}
            />
            <button className="sr-only" />
          </form>
          <p className="flex ml-auto items-center gap-2">
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

      <div>
        <h2 className="mb-2">Corner Radius</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateCornerRadius(setup);
          }}
          ref={cornerRadiusFormRef}
        >
          <Input
            icon={<TbBorderCorners />}
            name="radius"
            value={getCornerRadiusValue()}
            onChange={() => updateCornerRadius(setup)}
          />

          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              icon={<RxCornerTopLeft />}
              name="tl"
              onChange={updateSpecificCornerRadius}
              value={cornerRadius.tl}
            />
            <Input
              icon={<RxCornerTopRight />}
              name="tr"
              onChange={updateSpecificCornerRadius}
              value={cornerRadius.tr}
            />
            <Input
              icon={<RxCornerBottomLeft />}
              name="bl"
              onChange={updateSpecificCornerRadius}
              value={cornerRadius.bl}
            />
            <Input
              icon={<RxCornerBottomRight />}
              name="br"
              onChange={updateSpecificCornerRadius}
              value={cornerRadius.br}
            />
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-2">Inverted Corners</h2>
        <div className="grid grid-cols-2 gap-3">
          <CheckBox
            checked={invertedCorners.tl.inverted}
            onChange={() => toggleInversion("tl")}
            icon={<InvertedTopRightCorner rotation={-90} />}
          >
            Top Left
          </CheckBox>

          <CheckBox
            checked={invertedCorners.tr.inverted}
            onChange={() => toggleInversion("tr")}
            icon={<InvertedTopRightCorner />}
          >
            Top Right
          </CheckBox>

          <CheckBox
            checked={invertedCorners.bl.inverted}
            onChange={() => toggleInversion("bl")}
            icon={<InvertedTopRightCorner rotation={180} />}
          >
            Bottom Left
          </CheckBox>

          <CheckBox
            checked={invertedCorners.br.inverted}
            onChange={() => toggleInversion("br")}
            icon={<InvertedTopRightCorner rotation={90} />}
          >
            Bottom Right
          </CheckBox>
        </div>
      </div>
    </div>
  );
};

export default Controllers;
