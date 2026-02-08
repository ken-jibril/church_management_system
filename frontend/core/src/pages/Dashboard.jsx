import { useEffect, useState } from "react";
import { getMembers } from "../services/memberService";
import { getActivities } from "../services/activityService";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import RecentMembers from "../components/RecentMembers";
import RecentActivities from "../components/RecentActivities";

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-600 font-medium"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard title="Members" value={members.length} />
        <StatCard title="Activities" value={activities.length} />
      </div>

      {/* Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentMembers members={members} />
        <RecentActivities activities={activities} />
      </div>
    </div>
  );
};

export default Dashboard;
