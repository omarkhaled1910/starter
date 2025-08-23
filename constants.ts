export const COOKIE_USER = "USER";
export const COOKIE_TOKEN = "TOKEN_ADDRESS";


export const supportedChains = [
  // EVM-compatible networks (EIP-155 namespace)
  "eip155:1", // Ethereum Mainnet
  "eip155:10", // Optimism Mainnet
  "eip155:324", // zkSync Era Mainnet
  "eip155:11155111", // Sepolia (Ethereum testnet)

  // Non-EVM chain (Solana uses its own namespace)
  "solana:mainnet", // Solana Mainnet
];