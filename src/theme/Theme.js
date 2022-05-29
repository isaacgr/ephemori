export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // primary: {
          //   main: "#3396b6",
          //   contrastText: "#fafffd"
          // },
          // secondary: {
          //   main: "#fa824c"
          // },
          text: {
            primary: "#30363c",
            secondary: "#95a5a6"
          }
        }
      : {
          // primary: {
          //   main: "#3396b6",
          //   contrastText: "#ffffff"
          // },
          // secondary: {
          //   main: "#fa824c"
          // }
        })
  }
});
