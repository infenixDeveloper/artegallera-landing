import { createTheme } from "@mui/material/styles";

// export const lightTheme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#ededed",
//     },
//     background: {
//       default: "#f5f5f5",
//       paper: "#fff",
//       primary: "#bebebe"
//     },
//     text: {
//       primary: "#333",
//     },
//   },
// });

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1d1d1d",
      primary: "#202020"
    },
    text: {
      primary: "#fff",
    },
  },
});
