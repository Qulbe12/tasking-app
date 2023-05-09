import { Select, Title } from "@mantine/core";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { useTranslation } from "react-i18next";
import { IconLanguage } from "@tabler/icons";

const AuthLayout = () => {
  const { i18n } = useTranslation();
  const { token } = useAppSelector((state) => state.auth);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-4">
        <Outlet />
      </div>
      <div className="bg-indigo-500 col-span-8 flex items-center justify-center">
        <Title color="white">Hexa</Title>
      </div>
      <div className="absolute top-0 right-0 p-4">
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
      </div>
    </div>
  );
};

export default AuthLayout;
