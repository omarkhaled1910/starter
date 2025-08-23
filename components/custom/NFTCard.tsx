"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, LinkIcon, ExternalLinkIcon } from "lucide-react";
import NftImage from "./NftImage";

export interface NFT {
  id?: string;
  user_privy_id: string;
  token_id?: string;
  contract_address?: string;
  blockchain?: string;
  metadata?: object;
  image_url?: string;
  name?: string;
  description?: string;
  is_minted?: boolean;
  acquired_at?: Date;
  last_transferred_at?: Date;
  price?: number;
}

interface NFTCardProps {
  nft: NFT;
  onClick?: () => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onClick }) => {
  const {
    id,
    token_id,
    contract_address,
    blockchain,
    image_url,
    name,
    description,
    is_minted,
    acquired_at,
    last_transferred_at,
  } = nft;
  // console.log(nft, image_url);
  // Format blockchain name for display
  const formatBlockchain = (blockchain?: string) => {
    if (!blockchain) return "Unknown";
    return (
      blockchain.charAt(0).toUpperCase() + blockchain.slice(1).toLowerCase()
    );
  };

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // Truncate text helper
  const truncateText = (text?: string, maxLength: number = 50) => {
    if (!text) return "Untitled";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Truncate address helper
  const truncateAddress = (address?: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-md bg-white dark:bg-gray-900 p-0 space-y-0.5 gap-1"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          {image_url ? (
            <NftImage
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              height={400}
              image_url={image_url}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
              <span className="text-white text-6xl">🎨</span>
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={is_minted ? "default" : "secondary"}
              className={`${
                is_minted
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-orange-500 hover:bg-orange-600"
              } text-white`}
            >
              {is_minted ? "Minted" : "Draft"}
            </Badge>
          </div>

          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
              {formatBlockchain(blockchain)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className=" space-y-3 p-2">
        {/* Title and Description */}
        <div>
          <h3 className="font-semibold text-lg leading-tight mb-1">
            {truncateText(name, 25)}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {truncateText(description, 80)}
            </p>
          )}
        </div>

        {/* Token Info */}
        <div className="space-y-2 text-xs">
          {token_id && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Token ID:</span>
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                #{token_id}
              </span>
            </div>
          )}

          {contract_address && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Contract:</span>
              <div className="flex items-center space-x-1">
                <span className="font-mono text-sm">
                  {truncateAddress(contract_address)}
                </span>
                <ExternalLinkIcon className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-3 h-3" />
              <span>Acquired: {formatDate(acquired_at)}</span>
            </div>
            {last_transferred_at && (
              <div className="text-right">
                <span>Last Transfer: {formatDate(last_transferred_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status indicator at bottom */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                is_minted ? "bg-green-400" : "bg-orange-400"
              }`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {is_minted ? "On-chain" : "Off-chain"}
            </span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ExternalLinkIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCard;
