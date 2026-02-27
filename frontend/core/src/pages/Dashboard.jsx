/**
 * Dashboard Page - Covenant Cloud Church Management System
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  DollarSign,
  Calendar,
  Heart,
  BookOpen,
  HandCoins,
  UsersRound,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../services/dashboardService";
import { StatusBadge } from "../components/ui/Badge";

const StatCard = ({ title, value, subtitle, icon: Icon, color, link }) => {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      icon: "bg-indigo-600",
      text: "text-indigo-600",
    },
    green: { bg: "bg-green-50", icon: "bg-green-600", text: "text-green-600" },
    blue: { bg: "bg-blue-50", icon: "bg-blue-600", text: "text-blue-600" },
    purple: {
      bg: "bg-purple-50",
      icon: "bg-purple-600",
      text: "text-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "bg-orange-600",
      text: "text-orange-600",
    },
    rose: { bg: "bg-rose-50", icon: "bg-rose-600", text: "text-rose-600" },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <Link to={link || "#"} className="block">
      <div
        className={`${c.bg} rounded-2xl p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            {subtitle && (
              <p className={`text-xs ${c.text} mt-1 font-medium`}>{subtitle}</p>
            )}
          </div>
          <div className={`${c.icon} p-3 rounded-xl`}>
            <Icon size={22} className="text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);

export default function Dashboard() {
  const { user, role } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await getDashboardStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err?.response?.data?.detail ||
              err.message ||
              "Failed to load dashboard data.",
          );
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setStats(null);
              }}
              className="mt-3 text-sm text-indigo-600 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {greeting()}, {user?.name?.split(" ")[0] || "Welcome"}! 👋
              </h1>
              <p className="text-indigo-200 mt-1 text-sm">
                Here's what's happening at Covenant Cloud today.
              </p>
            </div>
            <div className="text-right">
              <p className="text-indigo-200 text-xs">Today</p>
              <p className="text-white font-semibold text-sm">
                {new Date().toLocaleDateString("en-KE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            subtitle={`${stats.activeMembers} active`}
            icon={Users}
            color="indigo"
            link="/members"
          />
          <StatCard
            title="Monthly Giving"
            value={formatCurrency(stats.monthlyDonations)}
            subtitle="February 2026"
            icon={DollarSign}
            color="green"
            link="/giving"
          />
          <StatCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            subtitle="This month"
            icon={Calendar}
            color="blue"
            link="/events"
          />
          <StatCard
            title="Prayer Requests"
            value={stats.activePrayerRequests}
            subtitle="Active requests"
            icon={Heart}
            color="rose"
            link="/prayer-requests"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Sermons"
            value={stats.totalSermons}
            subtitle="Total recorded"
            icon={BookOpen}
            color="purple"
            link="/sermons"
          />
          <StatCard
            title="Total Donations"
            value={formatCurrency(stats.totalDonations)}
            subtitle="All time"
            icon={HandCoins}
            color="orange"
            link="/donations"
          />
          <StatCard
            title="Groups"
            value={stats.totalGroups}
            subtitle="Active groups"
            icon={UsersRound}
            color="indigo"
            link="/groups"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Members */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                Recent Members
              </h2>
              <Link
                to="/members"
                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {member.email}
                    </p>
                  </div>
                  <StatusBadge status={member.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                Upcoming Events
              </h2>
              <Link
                to="/events"
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {stats.upcomingEventsList.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-bold leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-xs leading-none opacity-80">
                      {new Date(event.date).toLocaleString("en", {
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {event.time} · {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Donations */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-600" />
                Recent Donations
              </h2>
              <Link
                to="/donations"
                className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign size={14} className="text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {donation.donor}
                      </p>
                      <p className="text-xs text-gray-500">{donation.type}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-bold text-green-600">
                      {formatCurrency(donation.amount)}
                    </p>
                    <StatusBadge status={donation.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {(role === "superadmin" ||
          role === "admin" ||
          role === "pastor" ||
          role === "registrar") && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Add Member",
                  path: "/members",
                  icon: Users,
                  color: "indigo",
                },
                {
                  label: "Record Donation",
                  path: "/donations",
                  icon: DollarSign,
                  color: "green",
                },
                {
                  label: "Create Event",
                  path: "/events",
                  icon: Calendar,
                  color: "blue",
                },
                {
                  label: "Add Sermon",
                  path: "/sermons",
                  icon: BookOpen,
                  color: "purple",
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition group"
                >
                  <action.icon
                    size={22}
                    className="text-gray-400 group-hover:text-indigo-600 transition"
                  />
                  <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-700 text-center">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
