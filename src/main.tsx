import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "./Providers";
import StoreProvider from "./redux/store";
import "./styles/index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <Providers />
    </StoreProvider>
  </React.StrictMode>,
);
