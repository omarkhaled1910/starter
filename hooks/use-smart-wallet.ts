import { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
  ECDSAOwnershipValidationModule,
} from "@biconomy/account";
import { Bundler } from "@biconomy/bundler";
import { BiconomyPaymaster } from "@biconomy/paymaster";
import { ChainId } from "@biconomy/core-types";
import { custom, createWalletClient } from "viem";
import { mainnet } from "viem/chains";

interface SmartAccountConfig {
  [chainId: number]: {
    paymasterUrl: string;
    bundlerUrl: string;
  };
}

const SMART_ACCOUNT_CONFIG: SmartAccountConfig = {
  11155420: {
    paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY_OPTIMISM!,
    bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL_OPTIMISM!,
  },
  324: {
    paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY_ZKSYNC!,
    bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL_ZKSYNC!,
  },
};

export function useSmartAccount(chainId: ChainId) {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initSmartAccount = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const privyEmbeddedWallet = wallets.find(
          (wallet) => wallet.walletClientType === "privy"
        );

        if (!privyEmbeddedWallet) {
          console.error("No Privy embedded wallet found.");
          return;
        }

        const config = SMART_ACCOUNT_CONFIG[chainId];
        if (!config) {
          console.error(`Smart account not configured for chain ${chainId}`);
          return;
        }

        const privyProvider = await privyEmbeddedWallet.getEthereumProvider();

        // We don’t need viem's walletClient directly — provider works fine
        const address = privyEmbeddedWallet.address;

        // Create Bundler and Paymaster
        const bundler = new Bundler({
          bundlerUrl: config.bundlerUrl,
          chainId,
          entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        });

        const paymaster = new BiconomyPaymaster({
          paymasterUrl: config.paymasterUrl,
        });

        const ecdsaModule = await ECDSAOwnershipValidationModule.create({
          signer: {
            async signMessage(msg: string) {
              const hexMessage = `0x${Buffer.from(msg, "utf8").toString(
                "hex"
              )}`;
              const signature = await privyProvider.request({
                method: "personal_sign",
                params: [hexMessage, address],
              });
              return signature;
            },
            async sendTransaction(tx: any) {
              const txHash = await privyProvider.request({
                method: "eth_sendTransaction",
                params: [tx],
              });
              return txHash;
            },
          } as any,
        });

        const biconomySmartAccount = await BiconomySmartAccountV2.create({
          chainId,
          bundler,
          paymaster,
          entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
          defaultValidationModule: ecdsaModule,
          activeValidationModule: ecdsaModule,
        } as any);
        console.log("biconomySmartAccount", biconomySmartAccount);
        const accountAddress = await biconomySmartAccount.getAccountAddress();

        setSmartAccount(biconomySmartAccount);
        setSmartAccountAddress(accountAddress);
        console.log("Smart account created:", accountAddress);
      } catch (err) {
        console.error("Error creating smart account:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initSmartAccount();
  }, [user, wallets, chainId]);

  return {
    smartAccount,
    smartAccountAddress,
    isLoading,
  };
}
