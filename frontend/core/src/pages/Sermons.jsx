/**
 * Sermons Management Page - Covenant Cloud Church Management System
 * Empty state - backend endpoint coming soon
 */
import DashboardLayout from "../layouts/DashboardLayout";

const Sermons = () => {
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-blue-500 mb-2">
            Sermons Coming Soon
          </h2>
          <p className="text-indigo-500 text-sm">
            Sermons will be shown here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sermons;
