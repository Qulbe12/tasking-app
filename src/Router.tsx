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
import PaymentPage from "./views/settings/PaymentPage";
import SettingsLayout from "./layouts/SettingsLayout";
import DocumentPublicView from "./views/documents/DocumentPublicView";
import SheetsPage from "./views/sheets/SheetsPage";
import DocumentsBoardView from "./views/documents/DocumentsBoardView";
import SheetDetails from "./views/sheets/SheetDetails";
import PaymentMethodsPage from "./views/settings/PaymentMethodsPage";
import ManageSeats from "./views/settings/ManageSeats";
import InvitationDetailsPage from "./views/invitation/InvitationDetailsPage";
import SecurityManagementPage from "./views/settings/SecurityManagementPage";
import ProfileManagementPage from "./views/settings/ProfileManagementPage";

const router = createBrowserRouter([
  {
    path: "accept/:invitationId/:token/:businessName/:ownerName",
    element: <InvitationDetailsPage />,
  },
  {
    path: "/documents/:documentId",
    element: <DocumentPublicView />,
  },
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
          {
            path: "/account/settings",
            element: <SettingsLayout />,
            children: [
              {
                path: "payments",
                element: <PaymentPage />,
              },
              {
                path: "payment-methods",
                element: <PaymentMethodsPage />,
              },
              {
                path: "manage-seats",
                element: <ManageSeats />,
              },
              {
                path: "security",
                element: <SecurityManagementPage />,
              },
              {
                path: "profile",
                element: <ProfileManagementPage />,
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
            path: "/board/sheets/:id",
            element: <SheetDetails />,
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
