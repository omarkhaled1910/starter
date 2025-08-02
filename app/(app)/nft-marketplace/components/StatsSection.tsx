import { FC } from "react";

const StatsSection: FC = () => {
  const stats = [
    { value: "250K+", label: "Artworks" },
    { value: "45K+", label: "Artists" },
    { value: "120K+", label: "Auctions" },
    { value: "$98M+", label: "Volume" },
  ];

  return (
    <section className="py-16">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-8 md:p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-xl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;