import { createEmotionCache, MantineProvider, MantineThemeOverride } from "@mantine/core";

import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { NotificationsProvider } from "@mantine/notifications";
import { useAppDispatch, useAppSelector } from "./redux/store";
import useSockets from "./hooks/useSockets";
import { NavigationProgress } from "@mantine/nprogress";
import { ModalsProvider } from "@mantine/modals";
import Version from "./components/Version";
import ProcessSheet from "./components/ProcessSheet";
import { useEffect } from "react";
import { resetBoardLoaders } from "./redux/slices/boardsSlice";
import { resetNylasLoaders } from "./redux/slices/nylasSlice";

const myCache = createEmotionCache({ key: "mantine", prepend: false });

const Providers = () => {
  const { mode } = useAppSelector((state) => state.theme);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetBoardLoaders());
    dispatch(resetNylasLoaders());
  }, []);

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
      <Version connected={isConnected} />
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
