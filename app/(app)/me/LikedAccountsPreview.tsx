"use client";
import { detectBlockchain, truncate } from "@/lib/utils";
import { usePrivy, LinkedAccountWithMetadata } from "@privy-io/react-auth";
import React from "react";

const LinkedAccountsList = () => {
  const { user } = usePrivy();
  const accounts = (user?.linkedAccounts as any) || [];
  return (
    <div className="grid grid-cols-1 gap-4">
      {accounts.map((account: any, index: number) => {
        const blockchain: any = detectBlockchain(account?.address) || "Unknown";

        return (
          <div
            key={index}
            className="border border-border rounded-lg p-4 bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-card-foreground font-bold">
                      {blockchain.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-medium capitalize text-card-foreground">
                    {account.type || "Wallet"}
                  </h3>
                </div>

                {account.id && (
                  <p
                    className="text-xs text-muted-foreground mt-1"
                    title={account.id}
                  >
                    ID: {truncate(account.id)}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {typeof account.imported === "boolean" && (
                  <span
                    className={`text-xs rounded-full px-2 py-1 ${
                      account.imported
                        ? "bg-green-500/20 text-green-700 dark:text-green-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {account.imported ? "Imported" : "Not Imported"}
                  </span>
                )}
                {typeof account.delegated === "boolean" && (
                  <span
                    className={`text-xs rounded-full px-2 py-1 ${
                      account.delegated
                        ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {account.delegated ? "Delegated" : "Not Delegated"}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <div className="flex justify-between items-center">
                <code
                  className="font-mono text-sm text-card-foreground break-all"
                  title={account.address}
                >
                  {truncate(account.address, 10, 8)}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(account.address)}
                  className="text-xs bg-accent text-accent-foreground rounded px-2 py-1 hover:bg-accent/90 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border flex justify-between">
              <span className="text-xs bg-sidebar text-sidebar-foreground rounded-full px-2 py-1">
                {blockchain}
              </span>
              <span className="text-xs text-muted-foreground">
                {account.id ? "Managed" : "External"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LinkedAccountsList;
