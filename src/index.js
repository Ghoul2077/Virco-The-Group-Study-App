import React from "react";
import ReactDOM from "react-dom";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LoginProvider } from "./context/LoginProvider";

ReactDOM.render(
  <React.StrictMode>
    <LoginProvider>
      <BrowserRouter>
        <Toaster
          toastOptions={{
            duration: 3500,
            style: {
              maxWidth: "600px",
            },
          }}
          reverseOrder={false}
          position="bottom-right"
        />
        <App />
      </BrowserRouter>
    </LoginProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
