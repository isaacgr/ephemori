export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#7DBD99"
          },
          secondary: {
            main: "#FFBAA8"
          },
          text: {
            primary: "#30363c",
            secondary: "#97b2e1"
          },
          background: {
            default: "#F2F4F6"
          }
        }
      : {
          primary: {
            main: "#7398AA"
          },
          secondary: {
            main: "#C5EA9A"
          },
          background: {
            default: "#264D7D"
          }
        })
  }
});
