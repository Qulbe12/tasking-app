import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";

const RouteGuard = () => {
  const auth = useAppSelector((state) => state.auth);

  if (!auth.token) return <Navigate to="/auth/login" />;

  return (
    <>
      <Outlet />
    </>
  );
};

export default RouteGuard;
