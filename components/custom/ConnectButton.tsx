// components/ConnectButton.tsx
import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { usePrivyLogin } from "@/hooks/use-privy-login";
import { PropagateLoader } from "react-spinners";
import { logout } from "@/app/actions/user";
  export default function ConnectButton() {
  const { login, logout :privyLogout, user, ready } = usePrivy();
  const { login: loginPrivy } = usePrivyLogin();

  if (!ready)
    return (
      <div className="min-w-[50px]">
        <PropagateLoader  className="text-primary"/>
      </div>
    );

  const isLoggedIn = !!user;
  console.log(user, ready);

  return (
    <>
    {  isLoggedIn ? (
        <button onClick={() => {privyLogout();logout();}} type="button" className="w-[120px] text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Disconnect</button>
      ) : (
        <button onClick={loginPrivy} type="button" className="w-[120px] text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Connect</button>
      )}
    
    </>
  );
}
