import { FC } from "react";

const HeroSection: FC = () => {
  return (
    <section className="py-16 md:py-24 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Discover, Collect, and Sell Extraordinary{" "}
          <span className="text-purple-500">NFTs</span>
        </h1>
        <p className="text-xl mb-8 opacity-80">
          The world's first and largest NFT marketplace for crypto collectibles
          and non-fungible tokens.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="px-8 py-4 bg-purple-500 text-white font-medium rounded-xl hover:bg-purple-600 transition-colors">
            Explore Marketplace
          </button>
          <button className="px-8 py-4 border-2 border-purple-500 text-purple-500 font-medium rounded-xl hover:bg-purple-500/10 transition-colors">
            Create NFT
          </button>
        </div>
      </div>

      <div className="md:w-1/2 flex justify-center">
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-64 h-64 rounded-3xl bg-purple-500/20 -z-10"></div>
          <div className="absolute -bottom-6 -right-6 w-64 h-64 rounded-3xl bg-purple-500/20 -z-10"></div>
          <div className="bg-gray-200 border-2 border-dashed rounded-3xl w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
            <span className="text-gray-500">NFT Artwork</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;