import { createEmotionCache, MantineProvider } from "@mantine/core";

import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { NotificationsProvider } from "@mantine/notifications";
import { useAppSelector } from "./redux/store";
import useSockets from "./hooks/useSockets";
import { NavigationProgress } from "@mantine/nprogress";
import { ModalsProvider } from "@mantine/modals";

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
      <NavigationProgress size={8} autoReset />

      <NotificationsProvider>
        {isConnected}
        <ModalsProvider>
          <RouterProvider router={router} />
        </ModalsProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default Providers;
