import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import CompleteSubscription from "../components/CompleteSubscription";

const RouteGuard = () => {
  const auth = useAppSelector((state) => state.auth);

  if (!auth.token) return <Navigate to="/auth/login" state={{ from: location }} />;

  if (auth.user?.user.subscription !== "active" && auth.user?.user.business.isOwner) {
    return <CompleteSubscription />;
  }

  return <Outlet />;
};

export default RouteGuard;
