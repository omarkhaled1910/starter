"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { getNFTsByUser } from "@/app/actions/nfts";
import NFTCard from "@/components/custom/NFTCard";

const NftLiked = () => {
  const { user } = usePrivy();
  const { data: nfts, isLoading } = useQuery({
    queryKey: ["nfts"],
    queryFn: () => getNFTsByUser(user?.id || ""),
  });
  return (
    <div>
      {nfts?.map((nft) => (
        <NFTCard nft={nft} key={nft.id} />
      ))}
    </div>
  );
};

export default NftLiked;
