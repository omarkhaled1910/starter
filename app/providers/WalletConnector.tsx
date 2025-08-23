import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function WalletConnector({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, connectWallet, logout } = usePrivy();
  const { wallets } = useWallets();

  useEffect(() => {
    if (ready && authenticated && wallets.length === 0) {
      connectWallet(); // This connects the embedded wallet into the session
    } else {
      // logout();
      toast.error("Please connect your wallet");
    }
  }, [ready, authenticated, wallets]);

  return <>{children}</>;
}
