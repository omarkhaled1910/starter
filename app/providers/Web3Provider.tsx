'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { config } from "@/config/wagmi";
import { PrivyProvider } from "@privy-io/react-auth";

const { wallets } = getDefaultWallets();


const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || ""}
          config={{}}
        >
          {children}
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}