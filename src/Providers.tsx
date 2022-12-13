import React from "react";
import { createEmotionCache, MantineProvider } from "@mantine/core";
import StoreProvider from "./redux/store";
import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { NotificationsProvider } from "@mantine/notifications";

const myCache = createEmotionCache({ key: "mantine", prepend: false });

const Providers = () => {
  return (
    <MantineProvider
      emotionCache={myCache}
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "light" }}
    >
      <StoreProvider>
        <NotificationsProvider>
          <RouterProvider router={router} />
        </NotificationsProvider>
      </StoreProvider>
    </MantineProvider>
  );
};

export default Providers;
