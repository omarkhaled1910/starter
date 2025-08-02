"use client";
import { getTokenDetails } from "@/app/actions/tokens";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

interface TokenDetailsProps {
  id: number;
  created_at: string;
  chainId: string;
  tokenAddress: string;
  name: string;
  uniqueName: string;
  symbol: string;
  decimals: number;
  logo: string;
  usdPrice: number;
  marketCap: number;
  liquidityUsd: number;
  holders: number;
  buyTransactions: { [key: string]: number };
  buyers: { [key: string]: number };
  pricePercentChange: { [key: string]: number };
  sellTransactions: { [key: string]: number };
  sellers: { [key: string]: number };
  totalVolume: { [key: string]: number };
  transactions: { [key: string]: number };
  source: string;
  createdAt: number;
}

const TokenDetails: React.FC<TokenDetailsProps> = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["token-details", id],
    queryFn: () => getTokenDetails(id as string),
  });
  console.log(data, "data");

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Get color for price change
  const getPriceChangeColor = (value: number) => {
    return value >= 0 ? "text-green-500" : "text-red-500";
  };

  // Time periods for display
  const timePeriods = ["1h", "4h", "12h", "24h"];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
          {data?.logo && (
            <img
              src={data?.logo}
              alt={data?.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                {data?.name} ({data?.symbol})
              </h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium rounded-full uppercase">
                  {data?.chainId}
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                  #{data?.id}
                </span>
              </div>
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm font-mono break-all">
              {data?.tokenAddress}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {formatCurrency(data?.usdPrice)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              USD Price
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Market Cap */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Market Cap
          </h3>
          <p className="mt-1 text-xl font-semibold">
            {formatCurrency(data?.marketCap)}
          </p>
        </div>

        {/* Liquidity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Liquidity
          </h3>
          <p className="mt-1 text-xl font-semibold">
            {formatCurrency(data?.liquidityUsd)}
          </p>
        </div>

        {/* Holders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Holders
          </h3>
          <p className="mt-1 text-xl font-semibold">
            {formatNumber(data?.holders)}
          </p>
        </div>

        {/* Total Volume (24h) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Volume (24h)
          </h3>
          <p className="mt-1 text-xl font-semibold">
            {formatCurrency(data?.totalVolume?.["24h"])}
          </p>
        </div>
      </div>

      {/* Price Change Grid */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {timePeriods.map((period) => (
          <div
            key={period}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5"
          >
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Price Change ({period})
            </h3>
            <p
              className={`mt-1 text-xl font-semibold ${getPriceChangeColor(
                data?.pricePercentChange?.[period]
              )}`}
            >
              {data?.pricePercentChange?.[period] > 0 ? "+" : ""}
              {(data?.pricePercentChange?.[period] * 100).toFixed(2)}%
            </p>
          </div>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buy Transactions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900/30 px-6 py-3 border-b border-green-100 dark:border-green-800">
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
              Buy Transactions
            </h2>
          </div>
          <div className="p-1">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="py-3 px-4 font-medium">Period</th>
                  <th className="py-3 px-4 font-medium text-right">
                    Transactions
                  </th>
                  <th className="py-3 px-4 font-medium text-right">Buyers</th>
                </tr>
              </thead>
              <tbody>
                {timePeriods.map((period) => (
                  <tr
                    key={period}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 font-medium">{period}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      {data?.buyTransactions?.[period]}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {data?.buyers?.[period]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sell Transactions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-red-50 dark:bg-red-900/30 px-6 py-3 border-b border-red-100 dark:border-red-800">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Sell Transactions
            </h2>
          </div>
          <div className="p-1">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="py-3 px-4 font-medium">Period</th>
                  <th className="py-3 px-4 font-medium text-right">
                    Transactions
                  </th>
                  <th className="py-3 px-4 font-medium text-right">Sellers</th>
                </tr>
              </thead>
              <tbody>
                {timePeriods.map((period) => (
                  <tr
                    key={period}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 font-medium">{period}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      {data?.sellTransactions?.[period]}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {data?.sellers?.[period]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Created At
          </h3>
          <p className="mt-1 font-medium">
            {new Date(data?.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Data Source
          </h3>
          <p className="mt-1 font-medium">{data?.source}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Decimals
          </h3>
          <p className="mt-1 font-medium">{data?.decimals}</p>
        </div>
      </div>

      {/* Total Transactions */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Total Transactions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {timePeriods.map((period) => (
            <div
              key={period}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {period}
              </p>
              <p className="text-lg font-bold mt-1">
                {data?.transactions?.[period]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;

// Example usage
/*
<TokenDetails
  id={337}
  created_at={'2025-07-18T13:51:58.514547+00:00'}
  chainId={'optimism'}
  tokenAddress={'0xc3864f98f2a61a7caeb95b039d031b4e2f55e0e9'}
  name={'OpenX Optimism'}
  uniqueName={'open-x-optimism'}
  symbol={'OpenX'}
  decimals={18}
  logo={'https://d23exngyjlavgo.cloudfront.net/0xa_0xc3864f98f2a61a7caeb95b039d031b4e2f55e0e9'}
  usdPrice={0.0361640788426}
  marketCap={597495}
  liquidityUsd={100453}
  holders={1978}
  buyTransactions={{ '1h': 33, '4h': 73, '12h': 149, '24h': 204 }}
  buyers={{ '1h': 15, '4h': 35, '12h': 59, '24h': 71 }}
  pricePercentChange={{
    '1h': 0.007917376735358719,
    '4h': 0.013230133187998996,
    '12h': 0.022059645798820353,
    '24h': 0.0669028476466828
  }}
  sellTransactions={{ '1h': 0, '4h': 19, '12h': 48, '24h': 108 }}
  sellers={{ '1h': 0, '4h': 13, '12h': 30, '24h': 55 }}
  totalVolume={{ '1h': 287, '4h': 829, '12h': 2472, '24h': 3485 }}
  transactions={{ '1h': 33, '4h': 92, '12h': 197, '24h': 312 }}
  source={'moralis'}
  createdAt={1708121185}
/>
*/
