import { Button } from "@/components/ui/button";
import { CoinsIcon, HeartIcon } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { createNFT } from "@/app/actions/nfts";
import { usePrivy } from "@privy-io/react-auth";

const MintButton = ({ url }: { url: string }) => {
  const { user } = usePrivy();
  return (
    <div className="flex gap-2 justify-end items-center mb-2">
      <Button
        onClick={async () => {
          if (!user) {
            toast.error("Please connect your wallet");
            return;
          }
          if (url) {
            await createNFT({
              user_privy_id: user?.id,
              image_url: url,
              name: "NFT",
              description: "NFT",
              is_minted: false,
              // acquired_at: new Date(),
              // last_transferred_at: new Date(),
            });
            toast.success("Liked");
          } else {
            toast.error("No URL provided");
          }
        }}
        variant="outline"
      >
        <HeartIcon className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => {
          if (url) {
            toast.success("Minted");
          } else {
            toast.error("No URL provided");
          }
        }}
      >
        <CoinsIcon className="w-4 h-4" />
        Mint
      </Button>
    </div>
  );
};

export default MintButton;
