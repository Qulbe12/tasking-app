import { createEmotionCache, MantineProvider, MantineThemeOverride } from "@mantine/core";

import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { NotificationsProvider } from "@mantine/notifications";
import { useAppSelector } from "./redux/store";
import useSockets from "./hooks/useSockets";
import { NavigationProgress } from "@mantine/nprogress";
import { ModalsProvider } from "@mantine/modals";
import Version from "./components/Version";
import ProcessSheet from "./components/ProcessSheet";

const myCache = createEmotionCache({ key: "mantine", prepend: false });

const Providers = () => {
  const { mode } = useAppSelector((state) => state.theme);

  const { isConnected } = useSockets();

  const theme: MantineThemeOverride = {
    colors: {},
    primaryColor: "indigo",
    primaryShade: 8,
    components: {
      Button: {
        defaultProps: {
          size: "sm",
          variant: "subtle",
        },
      },

      Icon: {
        defaultProps: {
          size: "2rem",
        },
      },
    },
  };

  return (
    <MantineProvider
      emotionCache={myCache}
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: mode, ...theme }}
    >
      <NavigationProgress size={8} autoReset />
      {isConnected ? "Connected" : "Not Connected"}
      <Version connected />
      <NotificationsProvider>
        <ModalsProvider>
          <RouterProvider router={router} />
          <ProcessSheet />
        </ModalsProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default Providers;
