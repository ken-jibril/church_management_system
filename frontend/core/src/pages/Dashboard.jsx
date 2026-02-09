import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMembers, getActivities } from "../services/dashboardService";
import RecentMembers from "../components/RecentMembers";
import RecentActivities from "../components/RecentActivities";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [membersData, activitiesData] = await Promise.all([
          getMembers(),
          getActivities(),
        ]);

        setMembers(membersData || []);
        setActivities(activitiesData || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Welcome back, {user?.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm md:text-base transition duration-200"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        <StatCard title="Members" value={members.length} />
        <StatCard title="Activities" value={activities.length} />
      </div>

      {/* Recent Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentMembers members={members} />
        <RecentActivities activities={activities} />
      </div>
    </div>
  );
};

export default Dashboard;
