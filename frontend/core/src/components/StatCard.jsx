const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between h-32 md:h-40 transition-transform transform hover:scale-105">
      <p className="text-sm md:text-base text-gray-500">{title}</p>
      <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
