"use server";

import {
  createBlockchainClient,
  type SupportedChain,
} from "./blockchain-client";

export interface HealthCheckResult {
  blockchain: SupportedChain;
  status: "healthy" | "error" | "warning";
  message: string;
  details?: {
    rpcConnected?: boolean;
    privateKeyConfigured?: boolean;
    contractConfigured?: boolean;
    blockNumber?: bigint;
  };
}

/**
 * Check the health of blockchain connections and configuration
 */
export async function checkBlockchainHealth(): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = [];
  const chains: SupportedChain[] = ["zksync", "optimism"];

  for (const blockchain of chains) {
    try {
      const { publicClient, contractAddress } = await createBlockchainClient(
        blockchain
      );

      // Test RPC connection
      const blockNumber = await publicClient.getBlockNumber();

      results.push({
        blockchain,
        status: "healthy",
        message: `${blockchain} connection successful`,
        details: {
          rpcConnected: true,
          privateKeyConfigured: true,
          contractConfigured: !!contractAddress,
          blockNumber,
        },
      });
    } catch (error: any) {
      let status: "error" | "warning" = "error";
      let message = error.message;

      // Determine severity based on error type
      if (error.message.includes("Private key not configured")) {
        status = "warning";
        message = `${blockchain}: Private key not configured in environment`;
      } else if (error.message.includes("Contract address not configured")) {
        status = "warning";
        message = `${blockchain}: Contract address not configured in environment`;
      } else if (error.message.includes("Unsupported blockchain")) {
        status = "error";
        message = `${blockchain}: Blockchain not supported`;
      } else {
        message = `${blockchain}: ${error.message}`;
      }

      results.push({
        blockchain,
        status,
        message,
        details: {
          rpcConnected: false,
          privateKeyConfigured: !error.message.includes(
            "Private key not configured"
          ),
          contractConfigured: !error.message.includes(
            "Contract address not configured"
          ),
        },
      });
    }
  }

  return results;
}

/**
 * Get configuration status for a specific blockchain
 */
export async function getBlockchainStatus(
  blockchain: SupportedChain
): Promise<HealthCheckResult> {
  const results = await checkBlockchainHealth();
  const result = results.find((r) => r.blockchain === blockchain);

  if (!result) {
    return {
      blockchain,
      status: "error",
      message: "Blockchain not found in health check",
    };
  }

  return result;
}

/**
 * Check if minting is available for a specific blockchain
 */
export async function isMintingAvailable(
  blockchain: SupportedChain
): Promise<boolean> {
  const status = await getBlockchainStatus(blockchain);
  return (
    status.status === "healthy" &&
    status.details?.rpcConnected === true &&
    status.details?.privateKeyConfigured === true &&
    status.details?.contractConfigured === true
  );
}
