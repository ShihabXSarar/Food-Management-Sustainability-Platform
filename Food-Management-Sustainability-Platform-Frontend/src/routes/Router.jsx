import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import InventoryPage from "../pages/InventoryPage";
import LogsPage from "../pages/LogsPage";
import ResourcesPage from "../pages/ResourcesPage";
import ProfilePage from "../pages/ProfilePage";
import UploadPage from "../pages/UploadPage";
import ProtectedRoute from "../privateRoute/ProtectedRoute"; // new
import EchoFoodAiModel from "../pages/EchoFoodAiModel";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "register", Component: RegisterPage },
      { path: "login", Component: LoginPage },

      {
        path: "dashboard",
        Component: () => (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory",
        Component: () => (
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "logs",
        Component: () => (
          <ProtectedRoute>
            <LogsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "resources",
        Component: () => (
          <ProtectedRoute>
            <ResourcesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        Component: () => (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "upload",
        Component: () => (
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path:"echofoodai",
    Component:EchoFoodAiModel
  },
]);

export default router;
