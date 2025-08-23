'use client';

import * as React from 'react';

import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  zksync,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { config } from "@/config/wagmi";
import {
  EthereumWalletConnector,
  PrivyClientConfig,
  PrivyProvider,
  usePrivy,
  useWallets,
  ConnectedWallet,
} from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

import { useSmartAccount } from "@/hooks/use-smart-wallet";
import { useSmartAccountStore } from "@/store/biconomyData";
import { useEffect } from "react";
import { WalletConnector } from "./WalletConnector";

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: false,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const privyTheme = "dark",
    accentColor = "#676FFF";
  const configPrivy: PrivyClientConfig = React.useMemo(() => {
    return {
      supportedChains: [optimism, zksync, arbitrum],

      embeddedWallets: {
        solana: { createOnLogin: "all-users" },
        ethereum: { createOnLogin: "all-users" },
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

        // ethereum: {
        //   connectors: EmbeddedWalletConnector,
        // },
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
        <SmartAccountProvider>
          <WalletConnector>
            <WagmiProvider config={config}>{children}</WagmiProvider>
          </WalletConnector>
        </SmartAccountProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}

const SmartAccountProvider = ({ children }: { children: React.ReactNode }) => {
  const { wallets } = useWallets();
  // const { user } = usePrivy();

  // console.log("wallets", wallets, user);
  if (!wallets.length) return <>{children}</>;
  const connectedWallet = wallets[0];
  const fallbackChainId = 10; // e.g. Optimism
  const chainId = connectedWallet?.chainId ?? fallbackChainId;
  const { smartAccount, isLoading, smartAccountAddress } = useSmartAccount(
    11155420 as any
  );

  console.log("smartAccountAddress", smartAccountAddress, smartAccountAddress);
  // if (isLoading) return <div>Loading...</div>;
  const { setSmartAccount } = useSmartAccountStore();
  useEffect(() => {
    console.log("smartAccount in SmartAccountProvider", smartAccount);
    if (smartAccount) {
      setSmartAccount(smartAccount);
    }
  }, [smartAccount]);
  console.log("smartAccount", smartAccount);
  return <div>{children}</div>;
};

