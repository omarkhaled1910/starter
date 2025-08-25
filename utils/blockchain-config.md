# Blockchain Configuration Guide

This guide explains how to set up the environment variables needed for NFT minting on different blockchains.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### zkSync Era Configuration

```bash
ZKSYNC_RPC_URL=https://mainnet.era.zksync.io
ZKSYNC_PRIVATE_KEY=0x... # Your private key for zkSync Era
ZKSYNC_NFT_CONTRACT_ADDRESS=0x... # Your deployed ERC721 contract address on zkSync Era
```

### Optimism Configuration

```bash
OPTIMISM_RPC_URL=https://mainnet.optimism.io
OPTIMISM_PRIVATE_KEY=0x... # Your private key for Optimism
OPTIMISM_NFT_CONTRACT_ADDRESS=0x... # Your deployed ERC721 contract address on Optimism
```

## Testnet Configuration (for development)

### zkSync Era Testnet

```bash
ZKSYNC_RPC_URL=https://testnet.era.zksync.dev
```

### Optimism Goerli Testnet

```bash
OPTIMISM_RPC_URL=https://goerli.optimism.io
```

## Contract Requirements

Your ERC721 contract must implement one of the following mint functions:

1. `mintTo(address to, string memory tokenURI) returns (uint256)` - Preferred
2. `mint(address to, uint256 tokenId, string memory tokenURI)` - Alternative
3. `safeMint(address to, uint256 tokenId)` - Fallback

## Security Notes

- Keep your private keys secure and never commit them to version control
- Use different private keys for different environments (mainnet/testnet)
- Consider using a dedicated wallet for minting operations
- Test thoroughly on testnets before deploying to mainnet

## Testing

1. Deploy your ERC721 contract to the desired networks
2. Set up the environment variables
3. Test minting functionality on testnets first
4. Monitor transaction costs and optimize as needed

## Supported Chains

Currently supported:

- zkSync Era (Mainnet: Chain ID 324)
- Optimism (Mainnet: Chain ID 10)

The system automatically determines which chain to use based on the `blockchain` field in the NFT metadata.
