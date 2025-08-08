'use client';

import * as React from 'react';

import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { config } from "@/config/wagmi";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: false,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const privyTheme = "dark",
    accentColor = "#676FFF";
  const configPrivy: PrivyClientConfig = React.useMemo(() => {
    return {
      embeddedWallets: {
        solana: { createOnLogin: "all-users" },
        ethereum: { createOnLogin: "off" },
        showWalletUIs: true,
      },
      fundingMethodConfig: {
        moonpay: {
          paymentMethod: "credit_debit_card", // Purchase with credit or debit card
          uiConfig: {
            accentColor: accentColor,
            theme: privyTheme,
          },
        },
      },
      loginMethods: ["email", "google", "wallet", "github"],
      appearance: {
        accentColor: accentColor,
        theme: privyTheme,
        // logo: "/alphaneural-logo.png",
      },
      solanaClusters: [
        {
          name: "mainnet-beta",
          rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
        },
      ],
      externalWallets: {
        solana: {
          connectors: solanaConnectors,
        },
      },
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || ""}
        config={configPrivy}
      >
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}