import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import { dashboardMenu } from "./DashboardConfig";
import { useAuth } from "../context/AuthContext";

const AppRouter = () => {
  const { admin } = useAuth();

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Login */}
        <Route
          path="/login"
          element={
            admin ? <Navigate to="/admin/dashboard" replace /> : <Login />
          }
        />

        {/* 🔐 Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {dashboardMenu.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={item.element}
            />
          ))}
        </Route>

        {/* 🔁 Default Redirect */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
