import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import UploadDocument from "./pages/UploadDocument";
import MyDocuments from "./pages/MyDocuments";
import AIChat from "./pages/AIChat";
import AdminDashboard from "./pages/AdminDashboard";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import { getToken } from "./api/client";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(getToken());

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const isAuthenticated = Boolean(getToken());
  const role = localStorage.getItem("user_role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={getToken() ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        <Route
          path="/register"
          element={getToken() ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="upload" element={<UploadDocument />} />
          <Route path="documents" element={<MyDocuments />} />
          <Route path="ai-chat" element={<AIChat />} />

          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="audit-logs"
            element={
              <AdminRoute>
                <AuditLogs />
              </AdminRoute>
            }
          />

          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}