const RecentActivities = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Upcoming Activities
      </h2>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">
          No activities available
        </p>
      ) : (
        <ul className="space-y-3">
          {activities.slice(0, 5).map((activity) => (
            <li
              key={activity.id}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-gray-700">
                {activity.title || activity.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivities;
