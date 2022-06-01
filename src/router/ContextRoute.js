import React from "react";

const ContextRoute = ({ contextProvider, children }) => {
  const Provider = contextProvider;

  return <Provider>{children}</Provider>;
};

export default ContextRoute;
