import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";

export const useCustomClient = () => {
  const { wallets } = useWallets();

  const privyEmbeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  const getChainId = async () => {
    if (!privyEmbeddedWallet) {
      throw new Error("No Privy embedded wallet found.");
    }

    const privyProvider = await privyEmbeddedWallet.getEthereumProvider();
    const client = createWalletClient({
      transport: custom(privyProvider), // use MetaMask provider
    });

    return client.chain;
  };
  return { getChainId };
};
