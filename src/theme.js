import { teal, cyan, orange, deepOrange } from "@mui/material/colors";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: "58px",
    boardBarHeight: "60px",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange,
      },
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
      },
    },
    // ...other
  },
  components: {
    //
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textTransform: "none",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        // Name of the slot
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: "0.875rem",
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Name of the slot
        root: ({ theme }) => {
          return {
            color: theme.palette.primary.main,
            fontSize: "0.875rem",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.light,
            },
            "&:hover": {
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            },
            // loai bỏ in đậm của input
            // '& fieldset':{
            //   borderWidth:'1px !important'
            // }
          };
        },
      },
    },
    // MuiCssBaseline: {
    //   styleOverrides: {
    //     body: {
    //       // css cho tất cả scroll bar
    //       "*::-webkit-scrollbar": {
    //         width: "8px",
    //         height: "8px",
    //       },
    //       "*::-webkit-scrollbar-thumb": {
    //         backGroundColor: "#c0392b",
    //         borderRadius: "8px",
    //       },
    //       "*::-webkit-scrollbar-thumb:hover": {
    //         backGroundColor: "red",
    //       },
    //     },
    //   },
    // },
  },
});

export default theme;
