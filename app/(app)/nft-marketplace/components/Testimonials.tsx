"use client";
import { FC } from "react";
import { useSmartAccountStore } from "@/store/biconomyData";

const Testimonials: FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Artist",
      content:
        "This platform completely transformed how I sell my digital art. The community is amazing and the fees are reasonable.",
      avatar: "👩‍🎨",
    },
    {
      name: "Michael Chen",
      role: "NFT Collector",
      content:
        "I've discovered incredible artists and built a valuable collection. The bidding process is seamless and secure.",
      avatar: "👨‍💼",
    },
    {
      name: "Emma Rodriguez",
      role: "Photographer",
      content:
        "Selling my photography as NFTs opened up a new revenue stream. The platform makes minting and selling so easy.",
      avatar: "👩‍💻",
    },
  ];

  // const { smartAccount, smartAccountAddress } = useBiconomy(10);
  const { smartAccount } = useSmartAccountStore();

  console.log("smartAccount", smartAccount);
  return (
    <section className="py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
        <p className="max-w-2xl mx-auto opacity-80">
          Hear from artists, collectors, and creators who are using our platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
          >
            <div className="text-5xl mb-4">{testimonial.avatar}</div>
            <p className="mb-6 italic">"{testimonial.content}"</p>
            <div>
              <div className="font-bold">{testimonial.name}</div>
              <div className="text-purple-500">{testimonial.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
