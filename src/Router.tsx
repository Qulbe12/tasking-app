import { createBrowserRouter } from "react-router-dom";
import RouteGuard from "./guards/RouteGuard";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import HomeLayout from "./layouts/HomeLayout";
import Forgot from "./views/auth/Forgot";
import Login from "./views/auth/Login";
import Pay from "./views/auth/Pay";
import Register from "./views/auth/Register";
import TemplateList from "./views/templates/TemplateList";
import Teams from "./views/teams/Teams";
import WorkspacesList from "./views/workspaces/WorkspacesList";
import BoardsList from "./views/board/BoardsList";
import EmailPage from "./views/email/EmailPage";
import AnalyticsPage from "./views/analytics/AnalyticsPage";
import PaymentPage from "./views/payment/PaymentPage";
import SettingsLayout from "./layouts/SettingsLayout";
import DocumentPublicView from "./views/documents/DocumentPublicView";
import SheetsPage from "./views/sheets/SheetsPage";
import DocumentsBoardView from "./views/documents/DocumentsBoardView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteGuard />,
    children: [
      {
        path: "/documents/:documentId",
        element: <DocumentPublicView />,
      },
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            path: "/",
            element: <WorkspacesList />,
          },
          {
            path: "/account/settings",
            element: <SettingsLayout />,
            children: [
              {
                path: "payment",
                element: <PaymentPage />,
              },
            ],
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
            element: <DocumentsBoardView />,
          },
          {
            path: "/board/sheets",
            element: <SheetsPage />,
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
