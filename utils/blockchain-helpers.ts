/**
 * Blockchain utility functions for smart contract deployment
 */

import {
  SupportedBlockchain,
  BlockchainConfig,
  NetworkDetectionResult,
  GasEstimate,
} from "@/types/deployment";

export const BLOCKCHAIN_CONFIGS: Record<SupportedBlockchain, BlockchainConfig> =
  {
    ethereum: {
      name: "ethereum",
      displayName: "Ethereum",
      chainId: 1,
      rpcUrl:
        process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || "https://eth.llamarpc.com",
      explorerUrl: "https://etherscan.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
    },
    optimism: {
      name: "optimism",
      displayName: "Optimism",
      chainId: 10,
      rpcUrl:
        process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL ||
        "https://optimism.llamarpc.com",
      explorerUrl: "https://optimistic.etherscan.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
    },
    zksync: {
      name: "zksync",
      displayName: "zkSync Era",
      chainId: 324,
      rpcUrl:
        process.env.NEXT_PUBLIC_ZKSYNC_RPC_URL ||
        "https://mainnet.era.zksync.io",
      explorerUrl: "https://explorer.zksync.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
    },
    solana: {
      name: "solana",
      displayName: "Solana",
      chainId: 101, // Mainnet-beta
      rpcUrl:
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
        "https://api.mainnet-beta.solana.com",
      explorerUrl: "https://explorer.solana.com",
      nativeCurrency: {
        name: "Solana",
        symbol: "SOL",
        decimals: 9,
      },
    },
    sepolia: {
      name: "sepolia",
      displayName: "Sepolia Testnet",
      chainId: 11155111,
      rpcUrl:
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
        "https://ethereum-sepolia.publicnode.com",
      explorerUrl: "https://sepolia.etherscan.io",
      nativeCurrency: {
        name: "Sepolia Ether",
        symbol: "SEP",
        decimals: 18,
      },
    },
  };

/**
 * Detects the blockchain network from Privy wallet connection
 */
export function detectBlockchainFromPrivy(
  connectedWallet: any
): NetworkDetectionResult | null {
  if (!connectedWallet) return null;

  // For Ethereum-compatible chains
  if (connectedWallet.walletClientType === "privy" || connectedWallet.chainId) {
    const chainId = connectedWallet.chainId;

    switch (chainId) {
      case "0x1": // Ethereum mainnet
      case 1:
        return {
          blockchain: "ethereum",
          chainId: 1,
          isTestnet: false,
          networkName: "Ethereum Mainnet",
        };
      case "0xa": // Optimism
      case 10:
        return {
          blockchain: "optimism",
          chainId: 10,
          isTestnet: false,
          networkName: "Optimism",
        };
      case "0x144": // zkSync Era
      case 324:
        return {
          blockchain: "zksync",
          chainId: 324,
          isTestnet: false,
          networkName: "zkSync Era",
        };
      case "0xaa36a7": // Sepolia testnet
      case 11155111:
        return {
          blockchain: "ethereum",
          chainId: 11155111,
          isTestnet: true,
          networkName: "Ethereum Sepolia",
        };
      default:
        return null;
    }
  }

  // For Solana
  if (connectedWallet.walletClientType === "solana") {
    return {
      blockchain: "solana",
      chainId: 101,
      isTestnet: false,
      networkName: "Solana Mainnet",
    };
  }

  return null;
}

/**
 * Generates a system-managed image URL for NFT metadata
 */
export function generateSystemImageUrl(
  contractName: string,
  blockchain: SupportedBlockchain
): string {
  const timestamp = Date.now();
  const sanitizedName = contractName.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `https://api.placeholder.com/512x512/6366f1/ffffff?text=${encodeURIComponent(
    contractName
  )}&${timestamp}`;
}

/**
 * Validates private key format for different blockchains
 */
export function validatePrivateKey(
  privateKey: string,
  blockchain: SupportedBlockchain
): boolean {
  if (!privateKey) return false;

  // Remove 0x prefix if present
  const cleanKey = privateKey.replace(/^0x/, "");

  switch (blockchain) {
    case "ethereum":
    case "optimism":
    case "zksync":
      // Ethereum-style private keys (64 hex characters)
      return /^[a-fA-F0-9]{64}$/.test(cleanKey);

    case "solana":
      // Solana private keys can be base58 encoded (around 88 characters) or hex (64 characters)
      return (
        /^[a-fA-F0-9]{64}$/.test(cleanKey) ||
        /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(privateKey)
      );

    default:
      return false;
  }
}

/**
 * Formats blockchain addresses for display
 */
export function formatAddress(address: string, length: number = 8): string {
  if (!address) return "";
  if (address.length <= length * 2) return address;

  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Gets the explorer URL for a transaction
 */
export function getExplorerUrl(
  txHash: string,
  blockchain: SupportedBlockchain
): string {
  const config = BLOCKCHAIN_CONFIGS[blockchain];

  switch (blockchain) {
    case "solana":
      return `${config.explorerUrl}/tx/${txHash}`;
    default:
      return `${config.explorerUrl}/tx/${txHash}`;
  }
}

/**
 * Gets the explorer URL for a contract address
 */
export function getContractExplorerUrl(
  contractAddress: string,
  blockchain: SupportedBlockchain
): string {
  const config = BLOCKCHAIN_CONFIGS[blockchain];

  switch (blockchain) {
    case "solana":
      return `${config.explorerUrl}/address/${contractAddress}`;
    default:
      return `${config.explorerUrl}/address/${contractAddress}`;
  }
}

/**
 * Estimates gas costs for deployment (mock implementation)
 */
export async function estimateDeploymentGas(
  blockchain: SupportedBlockchain
): Promise<GasEstimate> {
  // This is a simplified estimation - in production, you'd call the actual blockchain
  const baseGasLimits: Record<SupportedBlockchain, string> = {
    ethereum: "2000000",
    optimism: "2000000",
    zksync: "2000000",
    solana: "5000", // Lamports
    sepolia: "2000000",
  };

  const mockGasPrices: Record<SupportedBlockchain, string> = {
    ethereum: "20000000000", // 20 gwei
    optimism: "1000000000", // 1 gwei
    zksync: "250000000", // 0.25 gwei
    solana: "5000", // 5000 lamports
    sepolia: "20000000000", // 20 gwei
  };

  const gasLimit = baseGasLimits[blockchain];
  const gasPrice = mockGasPrices[blockchain];

  // Calculate estimated cost (simplified)
  const cost = BigInt(gasLimit) * BigInt(gasPrice);
  const estimatedCost =
    blockchain === "solana"
      ? (Number(cost) / 1e9).toFixed(4) // Convert lamports to SOL
      : (Number(cost) / 1e18).toFixed(6); // Convert wei to ETH

  return {
    gasLimit,
    gasPrice,
    estimatedCost: `${estimatedCost} ${BLOCKCHAIN_CONFIGS[blockchain].nativeCurrency.symbol}`,
  };
}

/**
 * Gets network status and health
 */
export async function getNetworkStatus(
  blockchain: SupportedBlockchain
): Promise<boolean> {
  try {
    const config = BLOCKCHAIN_CONFIGS[blockchain];
    const response = await fetch(config.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: blockchain === "solana" ? "getHealth" : "eth_blockNumber",
        params: [],
        id: 1,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error(`Network status check failed for ${blockchain}:`, error);
    return false;
  }
}

/**
 * Converts chain ID to hex format
 */
export function chainIdToHex(chainId: number): string {
  return `0x${chainId.toString(16)}`;
}

/**
 * Gets the display name for a blockchain
 */
export function getBlockchainDisplayName(
  blockchain: SupportedBlockchain
): string {
  return BLOCKCHAIN_CONFIGS[blockchain].displayName;
}
