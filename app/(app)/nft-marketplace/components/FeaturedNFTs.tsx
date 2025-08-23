import { FC } from "react";
import NFTCard from "./NFTCard";

const FeaturedNFTs: FC = () => {
  return (
    <section className="py-16">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold">Featured NFTs</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 font-medium">
            All
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 font-medium">
            Art
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 font-medium">
            Photography
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 font-medium">
            Collectibles
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <NFTCard key={item} id={item} />
        ))} */}
      </div>
    </section>
  );
};

export default FeaturedNFTs;