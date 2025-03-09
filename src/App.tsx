import { useState, useRef } from "react";
import Header from "./components/header.tsx";
import Controllers from "./components/Controllers.tsx";

function App() {
  const [setup, setSetup] = useState();
  const svgRef = useRef(null);

  return (
    <>
      <Header />
      <main className="grid md:grid-cols-[1fr_min(100%,300px)] gap-4 p-4">
        <div className="p-4 flex justify-center items-center">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="max-h-[70vh] outline"
          ></svg>
        </div>

        <Controllers />
      </main>
    </>
  );
}

export default App;
