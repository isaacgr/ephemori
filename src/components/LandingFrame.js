import React from "react";
import cover from "../images/default.png";

const LandingFrame = () => {
  const style = {
    backgroundImage: `url(${cover})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "45vh"
  };
  return <div className="landing-frame" style={style}></div>;
};

export default LandingFrame;
