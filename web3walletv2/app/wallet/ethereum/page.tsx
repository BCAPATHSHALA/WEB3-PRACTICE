"use client";

import { useWalletStore } from "@/store/use.wallet.store";
import { onGetAllWallets } from "@/utils/wallet.flows.util";
import { useEffect, useState } from "react";
import type { IWallet } from "@/types/types.wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletsList } from "../_components/wallets-list";
import { AddWalletDialog } from "../_components/add-wallet-dialog";
import { Wallet } from "lucide-react";

export default function EthereumWalletsPage() {
  const { wallets } = useWalletStore();
  const [ethereumWallets, setEthereumWallets] = useState<IWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const { ethereumWallets } = await onGetAllWallets();
        setEthereumWallets(ethereumWallets);
      } catch (error) {
        console.error("Failed to load wallets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallets();
  }, [wallets]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ethereum Wallets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your Ethereum wallets
          </p>
        </div>
        <AddWalletDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Ethereum Wallets</CardTitle>
          <CardDescription>
            {ethereumWallets.length} wallet
            {ethereumWallets.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading wallets...</div>
          ) : ethereumWallets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                No Ethereum wallets yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create a new Ethereum wallet to get started.
              </p>
              <AddWalletDialog />
            </div>
          ) : (
            <WalletsList wallets={ethereumWallets} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
