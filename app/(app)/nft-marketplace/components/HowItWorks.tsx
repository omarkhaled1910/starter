import { FC } from "react";

const HowItWorks: FC = () => {
  const steps = [
    {
      title: "Create Wallet",
      description: "Connect your crypto wallet to get started",
      icon: "👛",
    },
    {
      title: "Create Collection",
      description: "Upload your work and setup your collection",
      icon: "🖼️",
    },
    {
      title: "List for Sale",
      description: "Choose between auctions and fixed-price listings",
      icon: "💰",
    },
    {
      title: "Earn Money",
      description: "Collect earnings and track your sales",
      icon: "💸",
    },
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="max-w-2xl mx-auto opacity-80">
          Get started with our platform in just a few simple steps and begin
          your journey into the world of NFTs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center text-2xl mx-auto mb-6">
              {step.icon}
            </div>
            <h3 className="font-bold text-xl mb-2">{step.title}</h3>
            <p className="opacity-70">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;