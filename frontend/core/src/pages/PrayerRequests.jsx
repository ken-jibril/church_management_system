/**
 * Prayer Requests Management Page - Covenant Cloud Church Management System
 * Empty state - backend endpoint coming soon
 */
import DashboardLayout from "../layouts/DashboardLayout";

const PrayerRequests = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/20 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-blue-500 mb-2">
            Prayer Requests Coming Soon
          </h2>
          <p className="text-indigo-500 text-sm">
            Prayer requests will be shown here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrayerRequests;
