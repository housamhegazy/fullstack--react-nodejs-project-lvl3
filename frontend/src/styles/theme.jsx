const getDesignTokens = (mode) => ({
  palette: {
    // @ts-ignore
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          housam: {
            main: "#64748B",
          },
          faveColor: {
            main: "rgb(247,247,247)",
          },
          primary: {
            main: "#01579b",
          },
          background: {
            default: "#ffffffff",
            paper: "#ffffffff",
          },
        }
      : {
          // palette values for dark mode
          housam: {
            main: "#008080",
          },
          faveColor: {
            main: "#008080",
          },
          background: {
            default: "#001E3C",
            paper: "#001E3C",
          },
          primary: {
            main: "#17324D",
          },
        }),
  },
});

export default getDesignTokens;