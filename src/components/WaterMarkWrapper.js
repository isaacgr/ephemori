import React from "react";
import WaterMark from "./WaterMark";

const WaterMarkWrapper = ({ children, beginAlarm, text }) => {
  const options = {
    chunkWidth: 200,
    chunkHeight: 60,
    textAlign: "left",
    textBaseline: "bottom",
    globalAlpha: 0.4,
    font: "16px Microsoft Yahei",
    rotateAngle: -0.26,
    fillStyle: "#333"
  };

  return (
    <WaterMark
      waterMarkText={text}
      openSecurityDefense
      securityAlarm={beginAlarm}
      options={options}
    >
      {children}
    </WaterMark>
  );
};

export default WaterMarkWrapper;
