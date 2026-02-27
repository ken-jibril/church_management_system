/**
 * Reports Management Page - Covenant Cloud Church Management System
 * Uses reportsService (mock-backed until backend endpoint is added).
 */
import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getReports } from "../services/reportsService";
import { getMembers } from "../services/membersService";
import { getDonations } from "../services/donationsService";
import { getGiving } from "../services/givingService";
import PageHeader from "../components/ui/PageHeader";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);

// Simple bar chart component
const BarChart = ({
  data,
  valueKey,
  labelKey,
  color = "bg-indigo-500",
  formatValue = (v) => v,
}) => {
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-20 flex-shrink-0 text-right">
            {item[labelKey]}
          </span>
          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
            <div
              className={`${color} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
              style={{ width: `${(item[valueKey] / max) * 100}%` }}
            >
              <span className="text-xs text-white font-medium whitespace-nowrap">
                {formatValue(item[valueKey])}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Donut-style category breakdown
const CategoryBreakdown = ({ data, total }) => {
  const colors = [
    "bg-indigo-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-purple-500",
    "bg-rose-500",
  ];
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full flex-shrink-0 ${colors[i % colors.length]}`}
          />
          <span className="text-sm text-gray-700 flex-1">{item.category}</span>
          <span className="text-sm font-semibold text-gray-800">
            {formatCurrency(item.amount)}
          </span>
          <span className="text-xs text-gray-500 w-10 text-right">
            {total > 0 ? Math.round((item.amount / total) * 100) : 0}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Reports() {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("6months");

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reports, members, donations, giving] = await Promise.all([
        getReports(),
        getMembers(),
        getDonations(),
        getGiving()
      ]);
      setReportsData({ reports, members, donations, giving });
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReports(); }, [loadReports]);

  const totalGiving = reportsData?.reports?.givingByMonth?.reduce(
    (s, m) => s + m.amount,
    0,
  ) || 0;
  const totalGivingByCategory = reportsData?.reports?.givingByCategory?.reduce(
    (s, c) => s + c.amount,
    0,
  ) || 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "membership", label: "Membership", icon: Users },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "attendance", label: "Attendance", icon: Calendar },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <PageHeader
          title="Reports"
          subtitle="Analytics and insights for church management"
          icon={BarChart3}
          actions={
            <div className="flex items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                <Download size={16} />
                Export
              </button>
            </div>
          }
        />

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Members",
                  value: mockMembers.length,
                  change: "+3",
                  color: "indigo",
                },
                {
                  label: "Active Members",
                  value: mockMembers.filter((m) => m.status === "active")
                    .length,
                  change: "+2",
                  color: "green",
                },
                {
                  label: "Total Giving (6mo)",
                  value: formatCurrency(totalGiving),
                  change: "+12%",
                  color: "blue",
                },
                {
                  label: "Avg Monthly Giving",
                  value: formatCurrency(totalGiving / 6),
                  change: "+8%",
                  color: "purple",
                },
              ].map(({ label, value, change, color }) => (
                <div key={label} className={`bg-${color}-50 rounded-2xl p-4`}>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">
                    {value}
                  </p>
                  <p
                    className={`text-xs text-${color}-600 mt-1 flex items-center gap-1`}
                  >
                    <TrendingUp size={10} /> {change} vs last period
                  </p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users size={16} className="text-indigo-600" />
                  Membership Growth
                </h3>
                <BarChart
                  data={mockReports.membershipGrowth}
                  valueKey="count"
                  labelKey="month"
                  color="bg-indigo-500"
                />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign size={16} className="text-green-600" />
                  Monthly Giving (KES)
                </h3>
                <BarChart
                  data={mockReports.givingByMonth}
                  valueKey="amount"
                  labelKey="month"
                  color="bg-green-500"
                  formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
                />
              </div>
            </div>

            {/* Giving by Category */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-orange-600" />
                Giving by Category
              </h3>
              <CategoryBreakdown
                data={mockReports.givingByCategory}
                total={totalGivingByCategory}
              />
            </div>
          </div>
        )}

        {/* Membership Tab */}
        {activeTab === "membership" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Membership Growth Trend
                </h3>
                <BarChart
                  data={mockReports.membershipGrowth}
                  valueKey="count"
                  labelKey="month"
                  color="bg-indigo-500"
                />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Members by Role
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      role: "Pastor",
                      count: mockMembers.filter((m) => m.role === "pastor")
                        .length,
                    },
                    {
                      role: "Elder",
                      count: mockMembers.filter((m) => m.role === "elder")
                        .length,
                    },
                    {
                      role: "Treasurer",
                      count: mockMembers.filter((m) => m.role === "treasurer")
                        .length,
                    },
                    {
                      role: "Registrar",
                      count: mockMembers.filter((m) => m.role === "registrar")
                        .length,
                    },
                    {
                      role: "Deputy Registrar",
                      count: mockMembers.filter(
                        (m) => m.role === "deputy_registrar",
                      ).length,
                    },
                    {
                      role: "Member",
                      count: mockMembers.filter((m) => m.role === "member")
                        .length,
                    },
                  ].map(({ role, count }) => (
                    <div
                      key={role}
                      className="flex items-center justify-between py-2 border-b border-gray-50"
                    >
                      <span className="text-sm text-gray-700">{role}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{
                              width: `${(count / mockMembers.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-800 w-6 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gender breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">
                Gender Distribution
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Male",
                    count: mockMembers.filter((m) => m.gender === "Male")
                      .length,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Female",
                    count: mockMembers.filter((m) => m.gender === "Female")
                      .length,
                    color: "bg-pink-500",
                  },
                ].map(({ label, count, color }) => (
                  <div
                    key={label}
                    className="text-center p-6 bg-gray-50 rounded-2xl"
                  >
                    <div
                      className={`w-16 h-16 ${color} rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3`}
                    >
                      {count}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((count / mockMembers.length) * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === "financial" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Total Giving (6 months)</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatCurrency(totalGiving)}
                </p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Highest Month</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatCurrency(
                    Math.max(...mockReports.givingByMonth.map((m) => m.amount)),
                  )}
                </p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Average Monthly</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatCurrency(totalGiving / 6)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Monthly Giving Trend
                </h3>
                <BarChart
                  data={mockReports.givingByMonth}
                  valueKey="amount"
                  labelKey="month"
                  color="bg-green-500"
                  formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
                />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Giving by Category
                </h3>
                <CategoryBreakdown
                  data={mockReports.givingByCategory}
                  total={totalGivingByCategory}
                />
              </div>
            </div>

            {/* Top Givers */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">
                Recent Giving Records
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">
                        Member
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">
                        Category
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">
                        Amount
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockGiving.map((g) => (
                      <tr key={g.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{g.member}</td>
                        <td className="px-4 py-2">{g.category}</td>
                        <td className="px-4 py-2 font-semibold text-green-600">
                          {formatCurrency(g.amount)}
                        </td>
                        <td className="px-4 py-2 text-gray-500">{g.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">
                Monthly Attendance Trend
              </h3>
              <BarChart
                data={mockReports.attendanceByMonth}
                valueKey="count"
                labelKey="month"
                color="bg-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Average Attendance</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {Math.round(
                    mockReports.attendanceByMonth.reduce(
                      (s, m) => s + m.count,
                      0,
                    ) / mockReports.attendanceByMonth.length,
                  )}
                </p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Highest Attendance</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {Math.max(
                    ...mockReports.attendanceByMonth.map((m) => m.count),
                  )}
                </p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {Math.round(
                    (mockReports.attendanceByMonth.reduce(
                      (s, m) => s + m.count,
                      0,
                    ) /
                      mockReports.attendanceByMonth.length /
                      mockMembers.length) *
                      100,
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
