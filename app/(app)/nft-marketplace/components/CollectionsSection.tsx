import { FC } from "react";

const CollectionsSection: FC = () => {
  return (
    <section className="py-16">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold">Top Collections</h2>
        <a href="#" className="text-purple-500 font-medium hover:underline">
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-full"></div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">Collection {item}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  by Artist {item}
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Items</p>
                <p className="font-medium">1.{item}K</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Floor Price</p>
                <p className="font-medium">{item}.2 ETH</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Volume</p>
                <p className="font-medium">{item * 12}K ETH</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionsSection;