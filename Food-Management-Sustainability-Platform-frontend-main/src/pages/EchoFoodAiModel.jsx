import React from "react";
import Navbar from "../components/ui/layout/Navbar";
import { div } from "framer-motion/client";

const EchoFoodAiModel = () => {
  return (
    <div className="some">

        <Navbar/>
      <div
        style={{
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        <iframe
          src="https://glowing-sunburst-11c8e8.netlify.app/"
          title="Echo Food AI"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>
    </div>
  );
};

export default EchoFoodAiModel;
