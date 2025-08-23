import { getNFTById } from "@/app/actions/nfts";
import React from "react";

const NftDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const nft = await getNFTById(id);
  return <div>{nft.name}</div>;
};

export default NftDetailsPage;
