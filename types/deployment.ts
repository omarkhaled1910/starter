/**
 * TypeScript types for smart contract deployment functionality
 */

export type SupportedBlockchain =
  | "ethereum"
  | "optimism"
  | "zksync"
  | "solana"
  | "sepolia";

export interface DeploymentForm {
  privateKey: string;
  name: string;
  description: string;
}

export interface ContractDeploymentRequest {
  privateKey: string;
  name: string;
  description: string;
  blockchain: SupportedBlockchain;
  userPrivyId: string;
}

export interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  explorerUrl?: string;
  error?: string;
  gasUsed?: string;
  deploymentCost?: string;
}

export interface BlockchainConfig {
  name: string;
  displayName: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet?: boolean;
}

export interface ContractMetadata {
  name: string;
  description: string;
  image: string;
  external_link?: string;
  seller_fee_basis_points?: number;
  fee_recipient?: string;
}

export interface DeploymentStatus {
  step:
    | "idle"
    | "validating"
    | "generating-image"
    | "compiling"
    | "deploying"
    | "completed"
    | "error";
  message: string;
  progress: number; // 0-100
}

export interface NetworkDetectionResult {
  blockchain: SupportedBlockchain;
  chainId: number;
  isTestnet: boolean;
  networkName: string;
}

export interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  estimatedCost: string;
  estimatedCostUSD?: string;
}

// Error types for better error handling
export type DeploymentError =
  | "INVALID_PRIVATE_KEY"
  | "INSUFFICIENT_BALANCE"
  | "NETWORK_ERROR"
  | "CONTRACT_COMPILATION_FAILED"
  | "DEPLOYMENT_FAILED"
  | "UNSUPPORTED_NETWORK"
  | "RATE_LIMITED"
  | "UNKNOWN_ERROR";

export interface DeploymentErrorDetails {
  type: DeploymentError;
  message: string;
  details?: any;
  retryable: boolean;
}
