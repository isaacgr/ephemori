import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ScreenWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: ${(props) => props.bgColor || "#ffffff"};
  opacity: ${(props) => (props.loading ? 1 : 0)};
  visibility: ${(props) => (props.loading ? "visible" : "hidden")};
  transition: opacity 0.4s, visibility -0.3s linear 0.5s;
  z-index: 1000;
`;
const LoadingComponents = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
`;

const propTypes = {
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  logo: PropTypes.any,
  duration: PropTypes.number,
  text: PropTypes.any
};

const LoadingScreen = ({ bgColor, textColor, duration, logo, text }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, duration);
  }, []);
  return (
    <ScreenWrapper bgColor={bgColor} loading={loading}>
      <LoadingComponents>
        {text}
        {logo}
      </LoadingComponents>
    </ScreenWrapper>
  );
};

LoadingScreen.propTypes = propTypes;

export default LoadingScreen;
