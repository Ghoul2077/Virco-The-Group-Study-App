import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { PersistGate } from "redux-persist/integration/react";
import Router from "./Routes";
import createStore from "./store/configureStore";
import "./styles/index.css";

const store = createStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={store._persistor}>
        <Toaster
          toastOptions={{
            duration: 3500,
            style: {
              maxWidth: "600px",
            },
          }}
          reverseOrder={false}
        />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
