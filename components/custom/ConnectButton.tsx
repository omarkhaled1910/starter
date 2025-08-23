// components/ConnectButton.tsx
import { useActiveWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import React, { useEffect } from "react";
import { usePrivyLogin } from "@/hooks/use-privy-login";
import { CircleLoader } from "react-spinners";
import { logout } from "@/app/actions/user";
import { useCustomClient } from "@/hooks/use-custom-client";
export default function ConnectButton() {
  const { login, logout: privyLogout, user, ready, authenticated } = usePrivy();
  const { login: loginPrivy } = usePrivyLogin();
  const { wallets } = useWallets();
  const activeWallet = useActiveWallet();
  const { getChainId } = useCustomClient();
  useEffect(() => {
    if (ready && authenticated) {
      const fetchChainId = async () => {
        const chainId = await getChainId();
        console.log({ chainId });
      };
      fetchChainId();
    }
  }, [getChainId]);
  if (!ready)
    return (
      <div className="min-w-[50px]">
        <CircleLoader className="text-primary" />
      </div>
    );

  const isLoggedIn = ready && authenticated && wallets.length === 0;
  console.log({ user, ready, wallets, activeWallet, authenticated });

  // useEffect(() => {
  //   if (ready && !authenticated && wallets.length !== 0) {
  //     // loginPrivy();
  //     activeWallet?.wallet?.loginOrLink();
  //   }
  // }, [ready, authenticated, wallets]);

  return (
    <>
      {authenticated ? (
        <button
          onClick={() => {
            privyLogout();
            logout();
          }}
          type="button"
          className="w-[120px] text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  "
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={loginPrivy}
          type="button"
          className="w-[120px] text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          Connect
        </button>
      )}
    </>
  );
}
