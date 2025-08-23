import { NFT } from "@/components/custom/NFTCard";
import { FC } from "react";

const NFTCard: FC<{ nft: NFT }> = ({ nft }) => {
  const { id, name, description, image_url, price } = nft;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative">
        <div className="bg-gray-200 border-2 border-dashed w-full h-64"></div>
        <button className="absolute top-4 right-4 bg-white dark:bg-gray-900 rounded-full p-2 shadow-md">
          <span>❤️</span>
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2">{name}</h3>
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-200 border-2 border-dashed rounded-full mr-2"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            @artist{id}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Current Bid
            </p>
            <p className="font-bold">{price ? price : 0} ETH</p>
          </div>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors">
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
