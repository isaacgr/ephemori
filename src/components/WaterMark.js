import React from "react";
import ReactWaterMark from "react-watermark-component";

const WaterMark = ({ children, beginAlarm, text }) => {
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
    <ReactWaterMark
      waterMarkText={text}
      openSecurityDefense
      securityAlarm={beginAlarm}
      options={options}
    >
      {children}
    </ReactWaterMark>
  );
};

export default WaterMark;
