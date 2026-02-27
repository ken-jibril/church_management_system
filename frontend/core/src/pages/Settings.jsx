/**
 * Settings Management Page - Covenant Cloud Church Management System
 * Uses settingsService (mock-backed until backend endpoint is added).
 */
import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Church,
  Bell,
  Globe,
  Save,
  User,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getSettings, updateSettings } from "../services/settingsService";
import PageHeader from "../components/ui/PageHeader";

export default function SettingsPage() {
  const { can, user, role } = useAuth();
  const [activeTab, setActiveTab] = useState("church");
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSettings();
      setChurchSettings(data.church);
      setNotifSettings(data.notifications);
      setSystemSettings(data.system);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to load settings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const [churchSettings, setChurchSettings] = useState({});
  const [notifSettings, setNotifSettings] = useState({});
  // const [systemSettings, setSystemSettings] = useState({});
  const [systemSettings, setSystemSettings] = useState(mockSettings.system);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isAdmin = can("settings", "update");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "church", label: "Church Info", icon: Church, adminOnly: true },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Globe, adminOnly: true },
  ].filter((t) => !t.adminOnly || isAdmin);

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-indigo-600" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <PageHeader
          title="Settings"
          subtitle="Manage your preferences and church configuration"
          icon={Settings}
          actions={
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm ${
                saved
                  ? "bg-green-600 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <Save size={16} />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          }
        />

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar Tabs */}
          <div className="lg:w-48 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  My Profile
                </h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-indigo-600">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="text-xs text-indigo-600 mt-1 capitalize">
                      {role?.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Lock size={14} />
                    Change Password
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={profileForm.currentPassword}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Current password"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={profileForm.newPassword}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="New password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={profileForm.confirmPassword}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Church Info Tab */}
            {activeTab === "church" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Church Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Church Name", key: "name", type: "text" },
                    {
                      label: "Denomination",
                      key: "denomination",
                      type: "text",
                    },
                    { label: "Phone", key: "phone", type: "tel" },
                    { label: "Email", key: "email", type: "email" },
                    { label: "Website", key: "website", type: "url" },
                    { label: "Year Founded", key: "founded", type: "text" },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={churchSettings[key]}
                        onChange={(e) =>
                          setChurchSettings({
                            ...churchSettings,
                            [key]: e.target.value,
                          })
                        }
                        disabled={!isAdmin}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={churchSettings.address}
                    onChange={(e) =>
                      setChurchSettings({
                        ...churchSettings,
                        address: e.target.value,
                      })
                    }
                    disabled={!isAdmin}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Church Motto
                  </label>
                  <input
                    value={churchSettings.motto}
                    onChange={(e) =>
                      setChurchSettings({
                        ...churchSettings,
                        motto: e.target.value,
                      })
                    }
                    disabled={!isAdmin}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      desc: "Receive notifications via email",
                    },
                    {
                      key: "smsNotifications",
                      label: "SMS Notifications",
                      desc: "Receive notifications via SMS",
                    },
                    {
                      key: "eventReminders",
                      label: "Event Reminders",
                      desc: "Get reminded about upcoming events",
                    },
                    {
                      key: "donationReceipts",
                      label: "Donation Receipts",
                      desc: "Receive receipts for donations",
                    },
                    {
                      key: "prayerRequestAlerts",
                      label: "Prayer Request Alerts",
                      desc: "Get notified of new prayer requests",
                    },
                    {
                      key: "weeklyDigest",
                      label: "Weekly Digest",
                      desc: "Receive a weekly summary email",
                    },
                  ].map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-3 border-b border-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {label}
                        </p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                      <ToggleSwitch
                        checked={notifSettings[key]}
                        onChange={(val) =>
                          setNotifSettings({ ...notifSettings, [key]: val })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === "system" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  System Settings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={systemSettings.currency}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          currency: e.target.value,
                        })
                      }
                      disabled={!isAdmin}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                    >
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Format
                    </label>
                    <select
                      value={systemSettings.dateFormat}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          dateFormat: e.target.value,
                        })
                      }
                      disabled={!isAdmin}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={systemSettings.timezone}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          timezone: e.target.value,
                        })
                      }
                      disabled={!isAdmin}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                    >
                      <option value="Africa/Nairobi">
                        Africa/Nairobi (EAT, UTC+3)
                      </option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">
                        America/New_York (EST)
                      </option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={systemSettings.language}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          language: e.target.value,
                        })
                      }
                      disabled={!isAdmin}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                    >
                      <option value="English">English</option>
                      <option value="Swahili">Swahili</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fiscal Year Start
                    </label>
                    <select
                      value={systemSettings.fiscalYearStart}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          fiscalYearStart: e.target.value,
                        })
                      }
                      disabled={!isAdmin}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                    >
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Danger Zone */}
                {role === "superadmin" && (
                  <div className="border border-red-200 rounded-xl p-4 mt-6">
                    <h3 className="text-sm font-semibold text-red-700 mb-3">
                      Danger Zone
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Clear All Data
                          </p>
                          <p className="text-xs text-gray-500">
                            Permanently delete all church data
                          </p>
                        </div>
                        <button className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-xs hover:bg-red-50 transition">
                          Clear Data
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Export All Data
                          </p>
                          <p className="text-xs text-gray-500">
                            Download a full backup of all data
                          </p>
                        </div>
                        <button className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition">
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
