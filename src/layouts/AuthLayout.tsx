import { Box, Flex, MediaQuery, Select, Title, useMantineTheme } from "@mantine/core";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { useTranslation } from "react-i18next";
import { IconLanguage } from "@tabler/icons";

const AuthLayout = () => {
  const { i18n } = useTranslation();
  const { token } = useAppSelector((state) => state.auth);
  const theme = useMantineTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <Flex>
      <MediaQuery smallerThan="md" styles={{ width: "100vw" }}>
        <Box w={"34%"}>
          <Outlet />
        </Box>
      </MediaQuery>
      <MediaQuery smallerThan="md" styles={{ display: "none" }}>
        <div className="bg-indigo-600 w-2/3 flex items-center justify-center">
          <Title color="white">Hexadesk</Title>
        </div>
      </MediaQuery>
      <Box
        className="absolute top-0 right-0 p-4"
        sx={{
          [theme.fn.smallerThan("sm")]: {
            padding: 6,
            position: "absolute",
            top: 25,
            width: "35%",
          },
        }}
      >
        <Select
          icon={<IconLanguage />}
          onChange={changeLanguage}
          value={i18n.language}
          placeholder="Pick one"
          size="xs"
          data={[
            { value: "en", label: "English" },
            { value: "fr", label: "Français" },
          ]}
        />
      </Box>
    </Flex>
  );
};

export default AuthLayout;
