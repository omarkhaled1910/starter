// components/ConnectButton.tsx
import { usePrivy } from "@privy-io/react-auth";
import React from "react";
export default function ConnectButton() {
  const { login, logout, user, ready } = usePrivy();

  //   if (!ready) return null;

  const isLoggedIn = !!user;
  console.log(user, ready);

  return (
    <button
      onClick={isLoggedIn ? logout : login}
      className={`
        px-6 py-3
        rounded-xl
        font-semibold
        shadow-md
        transition-all
        duration-300
        text-white
        ${
          isLoggedIn
            ? "bg-red-500 hover:bg-red-600"
            : "bg-indigo-600 hover:bg-indigo-700"
        }
        hover:scale-105
        active:scale-95
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-indigo-500
      `}
    >
      {isLoggedIn ? "Logout" : "Connect Wallet"}
    </button>
  );
}
