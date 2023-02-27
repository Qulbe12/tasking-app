import { createBrowserRouter } from "react-router-dom";
import RouteGuard from "./guards/RouteGuard";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import HomeLayout from "./layouts/HomeLayout";
import Forgot from "./views/auth/Forgot";
import Login from "./views/auth/Login";
import Pay from "./views/auth/Pay";
import Register from "./views/auth/Register";
import BoardDetails from "./views/board/BoardDetails";
import TemplateList from "./views/templates/TemplateList";
import DocumentsList from "./views/documents/DocumentsList";
import Teams from "./views/teams/Teams";
import WorkspacesList from "./views/workspaces/WorkspacesList";
import BoardsList from "./views/board/BoardsList";
import EmailPage from "./views/email/EmailPage";
import AnalyticsPage from "./views/analytics/AnalyticsPage";

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
            element: <WorkspacesList />,
          },
        ],
      },
      {
        path: "/workspaces/boards",
        element: <DashboardLayout />,
        children: [
          {
            path: "/workspaces/boards",
            element: <BoardsList />,
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
          {
            path: "/board/details",
            element: <BoardDetails />,
          },
          {
            path: "/board/analytics",
            element: <AnalyticsPage />,
          },
          {
            path: "/board/teams",
            element: <Teams />,
          },
          {
            path: "/board/emails",
            element: <EmailPage />,
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
