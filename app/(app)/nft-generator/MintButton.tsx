import { Button } from "@/components/ui/button";
import {
  CoinsIcon,
  HeartIcon,
  Wallet,
  CheckCircle,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { createNFT, NFTType, mintNFT } from "@/app/actions/nfts";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useMutation } from "@tanstack/react-query";
import { DotLoader, HashLoader } from "react-spinners";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Wizard, WizardStep } from "@/components/custom/Wizard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  SelectableCard,
  SelectableCardOption,
} from "@/components/custom/SelectableCard";

const MintButton = ({ url, type }: { url: string; type: NFTType }) => {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [nftMetadata, setNftMetadata] = useState({
    name: "",
    description: "",
    chain: "",
  });
  console.log(wallets);
  const { mutate: createNFTMutation, isPending } = useMutation({
    mutationFn: () =>
      createNFT({
        user_privy_id: user?.id || "",
        image_url: url,
        name: "NFT",
        description: "NFT",
        is_minted: false,
        type: type,
      }),
  });
  const { mutate: mintNFTMutation, isPending: isMinting } = useMutation({
    mutationFn: () =>
      mintNFT({
        user_privy_id: user?.id || "",
        image_url: url,
        name: nftMetadata.name || "NFT",
        description: nftMetadata.description || "NFT",
        is_minted: false,
        type: type,
      }),
  });
  const chainOptions: SelectableCardOption[] = [
    {
      id: "zksync",
      name: "zkSync Era",
      description: "Fast, low-cost Ethereum L2 with zero-knowledge proofs",
      icon: <Zap className="w-6 h-6 text-blue-500" />,
    },
    {
      id: "optimism",
      name: "Optimism",
      description: "Optimistic rollup scaling solution for Ethereum",
      icon: <Shield className="w-6 h-6 text-red-500" />,
    },
  ];

  const wizardSteps: WizardStep[] = [
    {
      id: "step-1",
      title: "Connect Wallet",
      isValid: !!user && wallets.length > 0,
      content: (
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Connect Your Wallet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {user && wallets.length > 0
                ? "✅ Wallet connected successfully!"
                : "Connect your wallet to proceed with minting your NFT."}
            </p>
            {(!user || wallets.length === 0) && (
              <p className="text-xs text-muted-foreground">
                Please connect your wallet from the header to continue.
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "step-2",
      title: "NFT Details",
      isValid:
        nftMetadata.name.trim() !== "" &&
        nftMetadata.description.trim() !== "" &&
        nftMetadata.chain !== "",
      content: (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="space-y-6">
            {/* Chain Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Select Blockchain *
              </Label>
              <SelectableCard
                options={chainOptions}
                selectedValue={nftMetadata.chain}
                onChange={(value) =>
                  setNftMetadata((prev) => ({ ...prev, chain: value }))
                }
                columns={2}
                className="mt-3"
              />
            </div>

            {/* NFT Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="nft-name">NFT Name *</Label>
                <Input
                  id="nft-name"
                  placeholder="Enter NFT name"
                  value={nftMetadata.name}
                  onChange={(e) =>
                    setNftMetadata((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="nft-description">Description *</Label>
                <Textarea
                  id="nft-description"
                  placeholder="Describe your NFT"
                  value={nftMetadata.description}
                  onChange={(e) =>
                    setNftMetadata((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-2 min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "step-3",
      title: "Mint NFT",
      isValid: true,
      content: (
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Ready to Mint!</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Review your NFT details and click finish to mint your NFT.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
              <div>
                <span className="font-medium">Name:</span> {nftMetadata.name}
              </div>
              <div>
                <span className="font-medium">Description:</span>{" "}
                {nftMetadata.description}
              </div>
              <div>
                <span className="font-medium">Chain:</span>{" "}
                {chainOptions.find((chain) => chain.id === nftMetadata.chain)
                  ?.name || nftMetadata.chain}
              </div>
              <div>
                <span className="font-medium">Type:</span> {type}
              </div>
            </div>
            {isMinting && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <HashLoader size={20} />
                <span className="text-sm">Minting your NFT...</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  const handleMintComplete = async () => {
    if (!user) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!url) {
      toast.error("No URL provided");
      return;
    }

    try {
      await mintNFTMutation();
      toast.success("NFT minted successfully!");
      setIsDrawerOpen(false);
      // Reset form
      setNftMetadata({ name: "", description: "", chain: "" });
    } catch (error) {
      toast.error("Failed to mint NFT");
    }
  };

  return (
    <div className="flex gap-2 justify-end items-center mb-2">
      <Button
        onClick={async () => {
          if (!user) {
            toast.error("Please connect your wallet");
            return;
          }
          if (url) {
            createNFTMutation();
            toast.success("Liked");
          } else {
            toast.error("No URL provided");
          }
        }}
        variant="outline"
      >
        {isPending ? (
          <DotLoader className="w-4 h-4" />
        ) : (
          <HeartIcon className="w-4 h-4" />
        )}
      </Button>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button>
            <CoinsIcon className="w-4 h-4 mr-2" />
            Mint
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-center">
            <DrawerTitle>Mint Your NFT</DrawerTitle>
            <DrawerDescription>
              Follow the steps below to mint your NFT to the blockchain.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto">
            <Wizard
              steps={wizardSteps}
              onComplete={handleMintComplete}
              nextButtonText="Continue"
              finishButtonText="Mint NFT"
              className="h-full"
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MintButton;
