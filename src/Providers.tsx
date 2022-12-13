import React from "react";
import { createEmotionCache, MantineProvider } from "@mantine/core";

import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { NotificationsProvider } from "@mantine/notifications";
import { useAppSelector } from "./redux/store";

const myCache = createEmotionCache({ key: "mantine", prepend: false });

const Providers = () => {
  const { mode } = useAppSelector((state) => state.theme);

  return (
    <MantineProvider
      emotionCache={myCache}
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: mode }}
    >
      <NotificationsProvider>
        <RouterProvider router={router} />
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default Providers;
