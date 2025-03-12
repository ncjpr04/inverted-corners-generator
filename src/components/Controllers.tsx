import { useRef, useState } from "react";
import { constraint, fixed, gcd } from "../utils";
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
const CheckBox = ({ icon, children, className, ...rest }: CheckBoxProps) => (
  <label
    className={`flex text-sm gap-2 justify-between items-center cursor-pointer p-2 rounded-md ${className}`}
  >
    <p className="flex items-center gap-2">
      {icon} {children}
    </p>
    <input type="checkbox" {...rest} role="switch" />
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
    updateInvertedCorners(corner, {});
  };

  const updateInvertedCorners = (
    corner: keyof typeof invertedCorners,
    newValues: Partial<typeof invertedCorners.tl>
  ) => {
    setInvertedCorners((prev) => {
      const { width, height } = setup;

      // Extract values for adjacent corners
      const { tl, tr, bl, br } = prev;

      // Extract values for corner radii
      const { tl: radTL, tr: radTR, bl: radBL, br: radBR } = cornerRadius;

      // Compute the available width & height for each corner based on constraints
      const maxWidth = {
        tl: tr.inverted
          ? width - tr.roundness - tl.roundness - tr.width
          : width - radTR - tl.roundness,

        tr: tl.inverted
          ? width - tr.roundness - tl.roundness - tl.width
          : width - radTL - tr.roundness,
        bl: br.inverted
          ? width - br.roundness - bl.roundness - br.width
          : width - radBR - bl.roundness,
        br: bl.inverted
          ? width - br.roundness - bl.roundness - bl.width
          : width - radBL - br.roundness,
      };

      const maxHeight = {
        tl: bl.inverted
          ? height - tl.roundness - bl.roundness - bl.height
          : height - radBL - tl.roundness,
        tr: br.inverted
          ? height - tr.roundness - br.roundness - br.height
          : height - radTR - br.roundness,
        bl: tl.inverted
          ? height - bl.roundness - tl.roundness - tl.height
          : height - radTL - bl.roundness,
        br: tr.inverted
          ? height - br.roundness - tr.roundness - tr.height
          : height - radBR - tr.roundness,
      };

      return {
        ...prev,
        [corner]: {
          ...prev[corner],
          width: fixed(
            Math.min(
              maxWidth[corner],
              Math.max(
                prev[corner].roundness * 2,
                newValues.width ?? prev[corner].width
              )
            )
          ),
          height: fixed(
            Math.min(
              maxHeight[corner],
              Math.max(
                prev[corner].roundness * 2,
                newValues.height ?? prev[corner].height
              )
            )
          ),
          roundness: fixed(newValues.roundness ?? prev[corner].roundness),
          inverted: newValues.inverted ?? prev[corner].inverted,
        },
      };
    });
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
              aria-label="shape width"
              defaultValue={setup.width}
              onBlur={updateDimensions}
            />
            &times;
            <Input
              icon={<span>H</span>}
              name="height"
              aria-label="shape height"
              defaultValue={setup.height}
              onBlur={updateDimensions}
            />
            <button className="sr-only" />
          </form>
          <p className="flex ml-auto items-center gap-2">
            <span className="sr-only">Aspect ratio:</span>
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
            aria-label="ALl Corners Border Radius"
            value={getCornerRadiusValue()}
            onChange={() => updateCornerRadius(setup)}
          />

          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              icon={<RxCornerTopLeft />}
              name="tl"
              aria-label="top left radius"
              onChange={updateSpecificCornerRadius}
              value={cornerRadius.tl}
            />
            <Input
              icon={<RxCornerTopRight />}
              name="tr"
              aria-label="top right radius"
              onChange={updateSpecificCornerRadius}
              value={cornerRadius.tr}
            />
            <Input
              icon={<RxCornerBottomLeft />}
              name="bl"
              aria-label="bottom left radius"
              onChange={updateSpecificCornerRadius}
              value={cornerRadius.bl}
            />
            <Input
              icon={<RxCornerBottomRight />}
              name="br"
              aria-label="bottom right radius"
              onChange={updateSpecificCornerRadius}
              value={cornerRadius.br}
            />
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-2">Inverted Corners</h2>
        <div className="border rounded-md p-1 mb-3">
          <CheckBox
            checked={invertedCorners.tl.inverted}
            onChange={() => toggleInversion("tl")}
            icon={<InvertedTopRightCorner rotation={-90} />}
          >
            Top Left
          </CheckBox>
          <div className="flex gap-2 mt-1">
            <Input
              icon={<span>W</span>}
              onChange={(e) =>
                updateInvertedCorners("tl", { width: +e.target.value! })
              }
              aria-label="top left inverted corner's width"
              value={invertedCorners.tl.width}
            />
            <Input
              icon={<span>H</span>}
              onChange={(e) =>
                updateInvertedCorners("tl", { height: +e.target.value! })
              }
              aria-label="top left inverted corner's height"
              value={invertedCorners.tl.height}
            />
            <Input
              icon={<RxCornerTopRight />}
              onChange={(e) =>
                updateInvertedCorners("tl", { roundness: +e.target.value! })
              }
              aria-label="top left inverted corner's roundness"
              value={invertedCorners.tl.roundness}
            />
          </div>
        </div>

        <div className="border rounded-md p-1 mb-3">
          <CheckBox
            checked={invertedCorners.tr.inverted}
            onChange={() => toggleInversion("tr")}
            icon={<InvertedTopRightCorner />}
          >
            Top Right
          </CheckBox>
          <div className="flex gap-2 mt-1">
            <Input
              icon={<span>W</span>}
              onChange={(e) =>
                updateInvertedCorners("tr", { width: +e.target.value! })
              }
              aria-label="top right inverted corner's width"
              value={invertedCorners.tr.width}
            />
            <Input
              icon={<span>H</span>}
              onChange={(e) =>
                updateInvertedCorners("tr", { height: +e.target.value! })
              }
              aria-label="top right inverted corner's height"
              value={invertedCorners.tr.height}
            />
            <Input
              icon={<RxCornerTopRight />}
              onChange={(e) =>
                updateInvertedCorners("tr", { roundness: +e.target.value! })
              }
              aria-label="top right inverted corner's roundness"
              value={invertedCorners.tr.roundness}
            />
          </div>
        </div>

        <div className="border rounded-md p-1 mb-3">
          <CheckBox
            checked={invertedCorners.br.inverted}
            onChange={() => toggleInversion("br")}
            icon={<InvertedTopRightCorner rotation={90} />}
          >
            Bottom Right
          </CheckBox>
          <div className="flex gap-2 mt-1">
            <Input
              icon={<span>W</span>}
              onChange={(e) =>
                updateInvertedCorners("br", { width: +e.target.value! })
              }
              aria-label="bottom right inverted corner's width"
              value={invertedCorners.br.width}
            />
            <Input
              icon={<span>H</span>}
              onChange={(e) =>
                updateInvertedCorners("br", { height: +e.target.value! })
              }
              aria-label="bottom right inverted corner's height"
              value={invertedCorners.br.height}
            />
            <Input
              icon={<RxCornerTopRight />}
              onChange={(e) =>
                updateInvertedCorners("br", { roundness: +e.target.value! })
              }
              aria-label="bottom right inverted corner's roundness"
              value={invertedCorners.br.roundness}
            />
          </div>
        </div>

        <div className="border rounded-md p-1 mb-3">
          <CheckBox
            checked={invertedCorners.bl.inverted}
            onChange={() => toggleInversion("bl")}
            icon={<InvertedTopRightCorner rotation={180} />}
          >
            Bottom Left
          </CheckBox>
          <div className="flex gap-2 mt-1">
            <Input
              icon={<span>W</span>}
              onChange={(e) =>
                updateInvertedCorners("bl", { width: +e.target.value! })
              }
              aria-label="bottom left inverted corner's width"
              value={invertedCorners.bl.width}
            />
            <Input
              icon={<span>H</span>}
              onChange={(e) =>
                updateInvertedCorners("bl", { height: +e.target.value! })
              }
              aria-label="bottom left inverted corner's height"
              value={invertedCorners.bl.height}
            />
            <Input
              icon={<RxCornerTopRight />}
              onChange={(e) =>
                updateInvertedCorners("bl", { roundness: +e.target.value! })
              }
              aria-label="bottom left inverted corner's roundness"
              value={invertedCorners.bl.roundness}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controllers;
