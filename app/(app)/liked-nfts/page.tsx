"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { getNFTsByUser } from "@/app/actions/nfts";

const NftLiked = () => {
  const { user } = usePrivy();
  const { data: nfts, isLoading } = useQuery({
    queryKey: ["nfts"],
    queryFn: () => getNFTsByUser(user?.id || ""),
  });
  return (
    <div>
      {nfts?.map((nft) => (
        <>{nft}</>
      ))}
    </div>
  );
};

export default NftLiked;
