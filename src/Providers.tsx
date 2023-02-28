import { createEmotionCache, MantineProvider } from "@mantine/core";

import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { NotificationsProvider } from "@mantine/notifications";
import { useAppSelector } from "./redux/store";
import useSockets from "./hooks/useSockets";

const myCache = createEmotionCache({ key: "mantine", prepend: false });

const Providers = () => {
  const { mode } = useAppSelector((state) => state.theme);
  const { isConnected } = useSockets();

  return (
    <MantineProvider
      emotionCache={myCache}
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: mode }}
    >
      <NotificationsProvider>
        {isConnected}
        <RouterProvider router={router} />
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default Providers;
