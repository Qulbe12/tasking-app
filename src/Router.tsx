import { createBrowserRouter } from "react-router-dom";
import RouteGuard from "./guards/RouteGuard";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import HomeLayout from "./layouts/HomeLayout";
import Dashboard from "./views/dashboard/Dashboard";
import Forgot from "./views/auth/Forgot";
import Login from "./views/auth/Login";
import Pay from "./views/auth/Pay";
import Register from "./views/auth/Register";
import BoardDetails from "./views/board/BoardDetails";
import TemplateList from "./views/templates/TemplateList";
import DocumentsList from "./views/documents/DocumentsList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteGuard />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
        ],
      },
      {
        path: "/board",
        element: <DashboardLayout />,
        children: [
          {
            path: "/board",
            element: <DocumentsList />,
          },
        ],
      },
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            path: "/templates",
            element: <TemplateList />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot",
        element: <Forgot />,
      },
      {
        path: "pay",
        element: <Pay />,
      },
    ],
  },
]);

export default router;
