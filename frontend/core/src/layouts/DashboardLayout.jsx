/**
 * DashboardLayout - Covenant Cloud Church Management System
 * Main layout with responsive sidebar navigation
 */
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  UserCog,
  HandCoins,
  BookOpen,
  Heart,
  UsersRound,
  ChevronDown,
  Bell,
  LogOut,
  User,
  ChevronRight,
  Church,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { RoleBadge } from "../components/ui/Badge";

const iconMap = {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  UserCog,
  HandCoins,
  BookOpen,
  Heart,
  UsersRound,
};

const NAV_ITEMS = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
    roles: [
      "superadmin",
      "admin",
      "pastor",
      "elder",
      "treasurer",
      "registrar",
      "deputy_registrar",
      "member",
    ],
  },
  {
    name: "Members",
    path: "/members",
    icon: "Users",
    roles: [
      "superadmin",
      "admin",
      "pastor",
      "elder",
      "treasurer",
      "registrar",
      "deputy_registrar",
      "member",
    ],
  },
  {
    name: "Donations",
    path: "/donations",
    icon: "DollarSign",
    roles: [
      "superadmin",
      "admin",
      "pastor",
      "elder",
      "treasurer",
      "registrar",
      "deputy_registrar",
      "member",
    ],
  },
  {
    name: "Events",
    path: "/events",
    icon: "Calendar",
    roles: [
      "superadmin",
      "admin",
      "pastor",
      "elder",
      "treasurer",
      "registrar",
      "deputy_registrar",
      "member",
    ],
  },
  {
    name: "Prayer Requests",
    path: "/prayer-requests",
    icon: "Heart",
    roles: [
      "superadmin",
      "admin",
      "pastor",
      "elder",
      "treasurer",
      "registrar",
      "deputy_registrar",
      "member",
    ],
  },
  {
    name: "Sermons",
    path: "/sermons",
    icon: "BookOpen",
    roles: [
      "superadmin",
      "admin",
      "pastor",
      "elder",
      "treasurer",
      "registrar",
      "deputy_registrar",
      "member",
    ],
  },
  {
    name: "Giving",
    path: "/giving",
    icon: "HandCoins",
    roles: [
      "superadmin",
      "admin",
      "pastor",
      "elder",
      "treasurer",
      "registrar",
      "deputy_registrar",
      "member",
    ],
  },
  {
    name: "Groups",
    path: "/groups",
    icon: "UsersRound",
    roles: [
      "superadmin",
      "admin",
      "pastor",
      "elder",
      "treasurer",
      "registrar",
      "deputy_registrar",
      "member",
    ],
  },
  {
    name: "Reports",
    path: "/reports",
    icon: "BarChart3",
    roles: [
      "superadmin",
      "admin",
      "pastor",
      "elder",
      "treasurer",
      "registrar",
      "deputy_registrar",
    ],
  },
  {
    name: "User Management",
    path: "/users",
    icon: "UserCog",
    roles: ["superadmin", "admin"],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "Settings",
    roles: [
      "superadmin",
      "admin",
      "pastor",
      "elder",
      "treasurer",
      "registrar",
      "deputy_registrar",
      "member",
    ],
  },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, role } = useAuth();

  const filteredNav = NAV_ITEMS.filter((item) =>
    item.roles.includes(role || "member"),
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleLabel = (r) => {
    const labels = {
      superadmin: "Super Admin",
      admin: "Admin",
      pastor: "Pastor",
      elder: "Elder",
      treasurer: "Treasurer",
      registrar: "Registrar",
      deputy_registrar: "Deputy Registrar",
      member: "Member",
    };
    return labels[r] || r;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen z-50
          bg-gradient-to-b from-slate-900 to-slate-800
          text-white flex flex-col
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "md:w-64" : "md:w-20"}
          w-72
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Church size={22} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-white leading-tight whitespace-nowrap">
                Covenant Cloud
              </h1>
              <p className="text-xs text-slate-400 whitespace-nowrap">
                Church Management
              </p>
            </div>
          )}
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto md:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {filteredNav.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                title={!sidebarOpen ? item.name : ""}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                      : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                  }
                `}
              >
                {Icon && (
                  <Icon
                    size={20}
                    className={`flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                  />
                )}
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">
                    {item.name}
                  </span>
                )}
                {sidebarOpen && isActive && (
                  <ChevronRight size={14} className="ml-auto text-indigo-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-slate-700 p-3">
          <div
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-700/60 cursor-pointer transition"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="flex-shrink-0 w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.charAt(0) || "U"}
            </div>
            {sidebarOpen && (
              <>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {getRoleLabel(role)}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          {profileOpen && sidebarOpen && (
            <div className="mt-2 bg-slate-700 rounded-xl overflow-hidden">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition"
                onClick={() => {
                  setProfileOpen(false);
                  setMobileOpen(false);
                }}
              >
                <User size={15} />
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-slate-600 hover:text-red-300 transition"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── TOP BAR ── */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center gap-4">
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 transition"
          >
            <Menu size={20} />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 transition"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb / Page title */}
          <div className="flex-1">
            <p className="text-sm text-gray-500">
              {NAV_ITEMS.find((n) => n.path === location.pathname)?.name ||
                "Dashboard"}
            </p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Role badge */}
            <div className="hidden sm:block">
              <RoleBadge role={role} />
            </div>

            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>

        {/* ── FOOTER ── */}
        <footer className="border-t border-gray-200 px-6 py-3 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Covenant Cloud Church Management System.
          All rights reserved.
        </footer>
      </div>
    </div>
  );
}
