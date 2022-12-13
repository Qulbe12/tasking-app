import { Title } from "@mantine/core";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";

const AuthLayout = () => {
  const { token } = useAppSelector((state) => state.auth);

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
    </div>
  );
};

export default AuthLayout;
