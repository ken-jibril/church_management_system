const RecentMembers = ({ members }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Members
      </h2>

      {members.length === 0 ? (
        <p className="text-sm text-gray-500">
          No members found
        </p>
      ) : (
        <ul className="space-y-3">
          {members.slice(0, 5).map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-gray-700">
                {member.name || member.full_name || "Unnamed member"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentMembers;
