// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmProvider } from "material-ui-confirm";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    {/* //Mui dialog */}
    <ConfirmProvider>
      <CssBaseline />
      <App />
      <ToastContainer theme="colored" position="bottom-right" />
    </ConfirmProvider>
  </CssVarsProvider>
  // </React.StrictMode>,
);
