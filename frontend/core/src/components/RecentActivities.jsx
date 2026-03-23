const RecentActivities = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        Upcoming Activities
      </h2>

      {activities.length === 0 ? (
        <p className="text-sm text-blue-500">No activities available</p>
      ) : (
        <ul className="space-y-3">
          {activities.slice(0, 5).map((activity) => (
            <li
              key={activity.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="text-sm md:text-base text-gray-700">
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
