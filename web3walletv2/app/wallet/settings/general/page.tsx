"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWalletStore } from "@/store/use.wallet.store";
import { onGetAllWallets } from "@/utils/wallet.flows.util";
import { useEffect, useState } from "react";

export default function GeneralSettingsPage() {
  const { wallets } = useWalletStore();
  const [stats, setStats] = useState({ total: 0, solana: 0, ethereum: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { allWallets, solanaWallets, ethereumWallets } =
          await onGetAllWallets();
        setStats({
          total: allWallets.length,
          solana: solanaWallets.length,
          ethereum: ethereumWallets.length,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    loadStats();
  }, [wallets]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">General Settings</h1>
        <p className="text-muted-foreground mt-1">
          View your wallet statistics and general information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Solana Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.solana}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ethereum Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.ethereum}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Wallet</CardTitle>
          <CardDescription>
            Information about your Web3 wallet application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Version</label>
            <p className="text-sm text-muted-foreground">1.0.0</p>
          </div>
          <div>
            <label className="text-sm font-semibold">Storage Type</label>
            <p className="text-sm text-muted-foreground">
              Encrypted Local Storage (AES-256-GCM)
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold">Supported Chains</label>
            <p className="text-sm text-muted-foreground">
              Solana (SPL), Ethereum (ERC-20)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
