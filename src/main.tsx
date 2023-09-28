import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import Providers from "./Providers";
import StoreProvider from "./redux/store";
import "./styles/index.scss";
import "./i18n/i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback="loading">
      <StoreProvider>
        <Providers />
      </StoreProvider>
    </Suspense>
  </React.StrictMode>,
);
