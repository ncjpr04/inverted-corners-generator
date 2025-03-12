import { useState, useRef, useEffect } from "react";
import Header from "./components/Header.tsx";
import Controllers from "./components/Controllers.tsx";
import Handlers from "./components/Handlers.tsx";
import { generatePath } from "./utils/index.ts";

function App() {
  const [setup, setSetup] = useState({ width: 100, height: 100 });
  const [cornerRadius, setCornerRadius] = useState({
    tl: 20,
    tr: 1,
    br: 10,
    bl: 10,
  });
  const [invertedCorners, setInvertedCorners] = useState({
    tl: { width: 20, height: 30, roundness: 10, inverted: false },
    tr: { width: 60, height: 30, roundness: 10, inverted: true },
    br: { width: 30, height: 20, roundness: 10, inverted: false },
    bl: { width: 20, height: 20, roundness: 10, inverted: true },
  });
  const [pathCode, setPathCode] = useState("");

  const pathRef = useRef(null);

  useEffect(() => {
    setPathCode(generatePath(setup, cornerRadius, invertedCorners));
  }, [setup, cornerRadius, invertedCorners]);

  return (
    <>
      <Header path={pathCode} setup={setup} />
      <main className="grid md:grid-cols-[1fr_min(100%,300px)] gap-4 p-4">
        <div className="p-4 flex justify-center items-center">
          <svg
            viewBox={`0 0 ${setup.width} ${setup.height}`}
            xmlns="http://www.w3.org/2000/svg"
            className="max-h-[70vh]"
          >
            <path ref={pathRef} d={pathCode} className="fill-coffee" />

            <Handlers
              cornerRadius={cornerRadius}
              setCornerRadius={setCornerRadius}
              invertedCorners={invertedCorners}
              setup={setup}
            />
          </svg>
        </div>

        <Controllers
          setup={setup}
          setSetup={setSetup}
          cornerRadius={cornerRadius}
          setCornerRadius={setCornerRadius}
          invertedCorners={invertedCorners}
          setInvertedCorners={setInvertedCorners}
        />
      </main>
    </>
  );
}

export default App;
