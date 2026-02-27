/**
 * AppRouter - Covenant Cloud Church Management System
 * Defines all application routes with role-based protection
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute, { RoleProtectedRoute } from "./ProtectedRoute";

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Members from "../pages/Members";
import Donations from "../pages/Donations";
import Events from "../pages/Events";
import PrayerRequests from "../pages/PrayerRequests";
import Sermons from "../pages/Sermons";
import Giving from "../pages/Giving";
import Groups from "../pages/Groups";
import UserManagement from "../pages/UserManagement";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

// All roles
const ALL_ROLES = [
  "superadmin",
  "admin",
  "pastor",
  "elder",
  "treasurer",
  "registrar",
  "deputy_registrar",
  "member",
];
// Staff roles (can create/update)
const STAFF_ROLES = [
  "superadmin",
  "admin",
  "pastor",
  "elder",
  "treasurer",
  "registrar",
  "deputy_registrar",
];
// Admin only
const ADMIN_ROLES = ["superadmin", "admin"];

function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected routes - all authenticated users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <RoleProtectedRoute allowedRoles={ALL_ROLES}>
              <Members />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/donations"
          element={
            <RoleProtectedRoute allowedRoles={ALL_ROLES}>
              <Donations />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <RoleProtectedRoute allowedRoles={ALL_ROLES}>
              <Events />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/prayer-requests"
          element={
            <RoleProtectedRoute allowedRoles={ALL_ROLES}>
              <PrayerRequests />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/sermons"
          element={
            <RoleProtectedRoute allowedRoles={ALL_ROLES}>
              <Sermons />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/giving"
          element={
            <RoleProtectedRoute allowedRoles={ALL_ROLES}>
              <Giving />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <RoleProtectedRoute allowedRoles={ALL_ROLES}>
              <Groups />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <RoleProtectedRoute allowedRoles={ALL_ROLES}>
              <Settings />
            </RoleProtectedRoute>
          }
        />

        {/* Staff-only routes */}
        <Route
          path="/reports"
          element={
            <RoleProtectedRoute allowedRoles={STAFF_ROLES}>
              <Reports />
            </RoleProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/users"
          element={
            <RoleProtectedRoute allowedRoles={ADMIN_ROLES}>
              <UserManagement />
            </RoleProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Page Not Found
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  The page you're looking for doesn't exist.
                </p>
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
