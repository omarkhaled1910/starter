"use server";

import { createWalletClient, createPublicClient, http, parseAbi, formatUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimism, zkSync } from "viem/chains";
import type { Chain, WalletClient, PublicClient } from "viem";

// Chain configuration with environment variables
const CHAIN_CONFIG = {
  zksync: {
    chain: zkSync,
    rpcUrl: process.env.ZKSYNC_RPC_URL || "https://mainnet.era.zksync.io",
    privateKey: process.env.ZKSYNC_PRIVATE_KEY,
    contractAddress: process.env.ZKSYNC_NFT_CONTRACT_ADDRESS,
  },
  optimism: {
    chain: optimism,
    rpcUrl: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
    privateKey: process.env.OPTIMISM_PRIVATE_KEY,
    contractAddress: process.env.OPTIMISM_NFT_CONTRACT_ADDRESS,
  },
} as const;

export type SupportedChain = keyof typeof CHAIN_CONFIG;

// ERC721 ABI for minting
const ERC721_ABI = parseAbi([
  "function mint(address to, uint256 tokenId, string memory tokenURI) external",
  "function safeMint(address to, uint256 tokenId) external",
  "function mintTo(address to, string memory tokenURI) external returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]);

interface ClientConfig {
  walletClient: WalletClient;
  publicClient: PublicClient;
  account: any;
  contractAddress: string;
}

/**
 * Creates viem clients for a specific blockchain
 */
export async function createBlockchainClient(blockchain: SupportedChain): Promise<ClientConfig> {
  const config = CHAIN_CONFIG[blockchain];
  
  if (!config) {
    throw new Error(`Unsupported blockchain: ${blockchain}`);
  }

  if (!config.privateKey) {
    throw new Error(`Private key not configured for ${blockchain}`);
  }

  if (!config.contractAddress) {
    throw new Error(`Contract address not configured for ${blockchain}`);
  }

  // Create account from private key
  const account = privateKeyToAccount(config.privateKey as `0x${string}`);

  // Create wallet client
  const walletClient = createWalletClient({
    account,
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  // Create public client for reading
  const publicClient = createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  return {
    walletClient,
    publicClient,
    account,
    contractAddress: config.contractAddress,
  };
}

/**
 * Get the next available token ID
 */
export async function getNextTokenId(blockchain: SupportedChain): Promise<bigint> {
  try {
    const { publicClient, contractAddress } = await createBlockchainClient(blockchain);
    
    const totalSupply = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: ERC721_ABI,
      functionName: "totalSupply",
    });

    return totalSupply + 1n;
  } catch (error) {
    console.error("Error getting next token ID:", error);
    // Fallback to timestamp-based ID if totalSupply is not available
    return BigInt(Date.now());
  }
}

/**
 * Mint an ERC721 NFT
 */
export async function mintERC721NFT(
  blockchain: SupportedChain,
  recipientAddress: string,
  tokenURI: string
): Promise<{
  success: boolean;
  transactionHash?: string;
  tokenId?: string;
  contractAddress?: string;
  error?: string;
}> {
  try {
    const { walletClient, publicClient, contractAddress } = await createBlockchainClient(blockchain);

    // Get next token ID
    const tokenId = await getNextTokenId(blockchain);

    // Prepare mint transaction - try different mint function signatures
    let hash: string;
    
    try {
      // Try mintTo function first (returns tokenId)
      hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "mintTo",
        args: [recipientAddress as `0x${string}`, tokenURI],
      });
    } catch (mintToError) {
      try {
        // Try mint function with tokenId and tokenURI
        hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: ERC721_ABI,
          functionName: "mint",
          args: [recipientAddress as `0x${string}`, tokenId, tokenURI],
        });
      } catch (mintError) {
        // Try safeMint function
        hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: ERC721_ABI,
          functionName: "safeMint",
          args: [recipientAddress as `0x${string}`, tokenId],
        });
      }
    }

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: hash as `0x${string}`,
    });

    if (receipt.status === "success") {
      return {
        success: true,
        transactionHash: hash,
        tokenId: tokenId.toString(),
        contractAddress: contractAddress,
      };
    } else {
      return {
        success: false,
        error: "Transaction failed",
      };
    }
  } catch (error: any) {
    console.error("Minting error:", error);
    return {
      success: false,
      error: error.message || "Unknown minting error",
    };
  }
}

/**
 * Get NFT details by token ID
 */
export async function getNFTDetails(
  blockchain: SupportedChain,
  tokenId: string
): Promise<{
  owner?: string;
  tokenURI?: string;
  exists?: boolean;
  error?: string;
}> {
  try {
    const { publicClient, contractAddress } = await createBlockchainClient(blockchain);

    const [owner, tokenURI] = await Promise.all([
      publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "ownerOf",
        args: [BigInt(tokenId)],
      }),
      publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
      }),
    ]);

    return {
      owner: owner as string,
      tokenURI: tokenURI as string,
      exists: true,
    };
  } catch (error: any) {
    return {
      exists: false,
      error: error.message || "NFT not found",
    };
  }
}

/**
 * Validate blockchain and get configuration
 */
export function validateBlockchain(blockchain: string): SupportedChain {
  const normalizedBlockchain = blockchain.toLowerCase() as SupportedChain;
  
  if (!CHAIN_CONFIG[normalizedBlockchain]) {
    throw new Error(`Unsupported blockchain: ${blockchain}. Supported chains: ${Object.keys(CHAIN_CONFIG).join(", ")}`);
  }
  
  return normalizedBlockchain;
}
