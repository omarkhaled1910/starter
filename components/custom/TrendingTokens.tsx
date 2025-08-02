"use client";
import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getTrendingTokens,
  getTrendingTokensCount,
  insterTrendingTokens,
} from "@/app/actions/tokens";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { Button } from "../ui/button";
import { PropagateLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const LIMIT = 10;
const TrendingTokens = () => {
  const [chain, setChain] = useQueryState("chain", {
    defaultValue: "solana",
  });
  const [cursor, setCursor] = useState(LIMIT);

  const navigate = useRouter();

  const { data: count } = useQuery({
    queryKey: ["trending-tokens-count", chain],
    queryFn: () => getTrendingTokensCount(chain),
  });
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["trending-tokens", chain],
    queryFn: ({ pageParam = 0 }) => getTrendingTokens(chain, pageParam, LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage?.length,
  });

  console.log("data", {
    data,
    count,
    status,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    cursor,
  });
  if (error) {
    toast.error("Failed to load tokens");
    return <div className="text-red-500 p-4">Error loading data</div>;
  }
  if (isFetching && data?.pages.length === 0) {
    return (
      <div className="space-y-4 flex justify-center items-center h-full">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="p-4 max-h-[80vh] overflow-y-auto">
      {/* <Button onClick={() => insertTokens()} disabled={isPending}>
        {isPending ? "Inserting..." : "Insert Tokens"}
      </Button> */}
      <h1 className="text-center text-lg text-accent-foreground mb-4">
        All Data is From moralis CACHED IN MY SUPABASE
      </h1>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Trending Tokens (
          {data?.pages.reduce((acc, page) => acc + (page?.length || 0), 0)}{" "}
          tokens)
        </h2>
        <Select onValueChange={setChain} value={chain}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solana">Solana</SelectItem>
            <SelectItem value="eth">Ethereum</SelectItem>
            <SelectItem value="arbitrum">Arbitrum</SelectItem>
            <SelectItem value="optimism">Optimism</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {data?.pages.map((page) =>
          page?.map((token, i) => (
            <div
              key={token.tokenAddress + token.name + i}
              onClick={() =>
                navigate.push(`/token-details/${token.tokenAddress}`)
              }
              className="p-4 border rounded-lg flex flex-wrap items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {token.logo && (
                <img
                  src={token.logo}
                  alt={token.name}
                  className="w-10 h-10 mr-4 rounded-full"
                  width={40}
                  height={40}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              <div className="flex-1">
                <div className="flex items-baseline">
                  <h3 className="font-semibold">{token.name}</h3>
                  <span className="text-muted-foreground ml-2">
                    {token.symbol}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Holders: {token.holders.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  $
                  {token.usdPrice.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </p>
                <p
                  className={`text-sm ${
                    token.pricePercentChange["24h"] >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {token.pricePercentChange["24h"] > 0 ? "+" : ""}
                  {token.pricePercentChange["24h"].toFixed(2)}%
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {isFetching && (
        <div className="space-y-4 flex justify-center items-center h-full">
          <PropagateLoader className="[&>span]:!bg-primary" />
        </div>
      )}

      {!isFetching && !error && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => {
              setCursor(Number(cursor) + LIMIT);
              fetchNextPage();
              toast.success(`Loading more tokens... ${cursor}`);
            }}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load more"
              : "No more data"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TrendingTokens;
