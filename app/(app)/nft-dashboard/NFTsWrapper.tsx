"use client";
import React, { memo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllNFTs, getAllNFTsCount } from "@/app/actions/nfts";
import NFTCard from "@/components/custom/NFTCard";
import Link from "next/link";
// import { useSelectedNFTStore } from "@/store/selectedNFT";
import { Button } from "@/components/ui/button";
import { PropagateLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

const LIMIT = 12; // Adjust as needed

const NFTsWrapper = ({
  searchTerm,
  status,
}: {
  searchTerm: string;
  status: "available" | "pending" | "sold";
}) => {
  // const { setClientStoredNFT } = useSelectedNFTStore();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status: queryStatus,
  } = useInfiniteQuery({
    queryKey: ["nfts", status, searchTerm],
    queryFn: ({ pageParam = 0 }) =>
      getAllNFTs(pageParam, LIMIT, searchTerm, status),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length < LIMIT) return undefined;
      return pages.length * LIMIT;
    },
  });

  if (error) {
    toast.error("Failed to load NFTs");
    return (
      <div className="text-red-500 p-4 text-center">Error loading NFTs</div>
    );
  }

  if (isFetching && (!data || data.pages.length === 0)) {
    return (
      <div className="space-y-4 flex justify-center items-center h-64">
        <Skeleton className="w-full h-32" />
      </div>
    );
  }

  const totalNFTs =
    data?.pages.reduce((acc, page) => acc + (page?.length || 0), 0) || 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats */}
      {totalNFTs > 0 && (
        <div className="flex flex-col items-center justify-center mb-6">
          <p>
            Showing {totalNFTs} {status} NFTs{" "}
            {searchTerm && `matching "${searchTerm}"`}
          </p>
          <span className="text-gray-500 text-xs">
            Infinite scroll pagination enabled
          </span>
        </div>
      )}

      {/* NFTs Grid */}
      {queryStatus !== "pending" && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data?.pages.map((page) =>
            page?.map((nft, i) => (
              <Link
                onClick={() => {
                  // setClientStoredNFT(nft);
                }}
                href={`/nft/${nft.id}`}
                key={nft.id + i}
              >
                <NFTCard key={nft.id} nft={nft} />
              </Link>
            ))
          )}
        </div>
      )}

      {/* No Results */}
      {!isFetching && totalNFTs === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No NFTs found matching your criteria
          </p>
        </div>
      )}

      {/* Loading Spinner */}
      {isFetching && totalNFTs > 0 && (
        <div className="flex justify-center mt-8">
          <PropagateLoader className="[&>span]:!bg-primary" />
        </div>
      )}

      {/* Load More Button */}
      {!isFetching && !error && totalNFTs > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => {
              fetchNextPage();
              toast.success("Loading more NFTs...");
            }}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load more"
              : "No more NFTs"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(NFTsWrapper);
