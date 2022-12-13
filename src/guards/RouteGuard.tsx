import React, { ReactElement, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";

type RouteGuardProps = {
  children?: ReactElement | ReactElement[];
};

const RouteGuard = ({ children }: RouteGuardProps) => {
  const auth = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  if (!auth.token) return <Navigate to="/auth/login" />;

  return (
    <>
      <Outlet />
    </>
  );
};

export default RouteGuard;
