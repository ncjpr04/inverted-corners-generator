import { useEffect, useRef } from "react";
import { constraint } from "../utils";

interface Props {
  cornerRadius: CornerRadius;
  setCornerRadius: React.Dispatch<React.SetStateAction<CornerRadius>>;
  setup: Setup;
}

const Handlers = ({ cornerRadius, setCornerRadius, setup }: Props) => {
  const activeHandler = useRef<number>(null);
  const circlesRef = useRef<SVGGElement>(null);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!circlesRef.current) return;
    const controller = new AbortController();

    circlesRef.current.addEventListener(
      "mousedown",
      (e) => {
        if (!e.target) return;
        const circle = e.target as SVGCircleElement;
        activeHandler.current = +circle.getAttribute("data-index")!;

        lastMouse.current.x = e.clientX;
        lastMouse.current.y = e.clientY;
      },
      { signal: controller.signal }
    );

    document.addEventListener(
      "mousemove",
      (e) => {
        if (activeHandler.current === null) return;

        const dx = (e.clientX - lastMouse.current.x) * 0.1;
        const dy = (e.clientY - lastMouse.current.y) * 0.1;
        lastMouse.current.x = e.clientX;
        lastMouse.current.y = e.clientY;

        switch (activeHandler.current) {
          case 0: // Top Left
            setCornerRadius((prev) => ({
              ...prev,
              tl: constraint(setup, prev.tl + dx + dy),
            }));
            break;
          case 1: // Top Right
            setCornerRadius((prev) => ({
              ...prev,
              tr: constraint(setup, prev.tr - dx + dy),
            }));
            break;
          case 2: // Bottom Right
            setCornerRadius((prev) => ({
              ...prev,
              br: constraint(setup, prev.br - dx - dy),
            }));
            break;
          case 3: // Bottom Left
            setCornerRadius((prev) => ({
              ...prev,
              bl: constraint(setup, prev.bl + dx - dy),
            }));
            break;
        }
      },
      { signal: controller.signal }
    );

    document.addEventListener(
      "mouseup",
      () => {
        activeHandler.current = null;
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
  }, []);

  return (
    <g ref={circlesRef} className="fill-coffee stroke-gray-300">
      <circle data-index={0} cx={cornerRadius.tl} cy={cornerRadius.tl} r="1" />
      <circle
        data-index={1}
        cx={setup.width - cornerRadius.tr}
        cy={cornerRadius.tr}
        r="1"
      />
      <circle
        data-index={2}
        cx={setup.width - cornerRadius.br}
        cy={setup.height - cornerRadius.br}
        r="1"
      />
      <circle
        data-index={3}
        cx={cornerRadius.bl}
        cy={setup.height - cornerRadius.bl}
        r="1"
      />
    </g>
  );
};

export default Handlers;
