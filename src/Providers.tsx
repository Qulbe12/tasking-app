import {
  ColorScheme,
  ColorSchemeProvider,
  createEmotionCache,
  MantineProvider,
} from "@mantine/core";

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
      <ColorSchemeProvider
        colorScheme={"dark"}
        toggleColorScheme={function (colorScheme?: ColorScheme | undefined): void {
          throw new Error("Function not implemented.");
        }}
      >
        <NotificationsProvider>
          {isConnected}
          <RouterProvider router={router} />
        </NotificationsProvider>
      </ColorSchemeProvider>
    </MantineProvider>
  );
};

export default Providers;
