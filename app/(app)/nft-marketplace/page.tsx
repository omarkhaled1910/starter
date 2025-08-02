import { FC } from "react";
import HeroSection from "./components/HeroSection";
import CollectionsSection from "./components/CollectionsSection";
import FeaturedNFTs from "./components/FeaturedNFTs";
import HowItWorks from "./components/HowItWorks";
import StatsSection from "./components/StatsSection";
import Testimonials from "./components/Testimonials";

const NftMarketplace: FC = () => {
  return (
    <div className="container mx-auto">
      <HeroSection />
      <CollectionsSection />
      <FeaturedNFTs />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
    </div>
  );
};

export default NftMarketplace;
