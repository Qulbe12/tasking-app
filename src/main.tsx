import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "./Providers";
import "./index.scss";
import StoreProvider from "./redux/store";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <Providers />
    </StoreProvider>
  </React.StrictMode>,
);
