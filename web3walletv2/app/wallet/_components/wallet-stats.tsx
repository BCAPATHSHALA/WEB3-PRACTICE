"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { IWallet } from "@/types/types.wallet";
import {
  getSolanaBalance,
  getSolanaAccountInfo,
  getSolanaTransactionCount,
  getSolanaLatestBlock,
} from "@/utils/rpc.solana.util";
import {
  getEthereumBalance,
  getEthereumAccountInfo,
  getEthereumTransactionCount,
  getEthereumLatestBlock,
} from "@/utils/rpc.ethereum.util";

interface WalletStatsProps {
  wallet: IWallet;
}

export function WalletStats({ wallet }: WalletStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSolana = wallet.coinType === "501";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isSolana) {
          const [balance, accountInfo, txCount, latestBlock] =
            await Promise.all([
              getSolanaBalance(wallet.publicKey),
              getSolanaAccountInfo(wallet.publicKey),
              getSolanaTransactionCount(wallet.publicKey),
              getSolanaLatestBlock(),
            ]);

          setStats({
            balance: balance.uiAmount,
            accountInfo,
            txCount,
            latestBlock,
          });
        } else {
          const [balance, accountInfo, txCount, latestBlock] =
            await Promise.all([
              getEthereumBalance(wallet.publicKey),
              getEthereumAccountInfo(wallet.publicKey),
              getEthereumTransactionCount(wallet.publicKey),
              getEthereumLatestBlock(),
            ]);

          setStats({
            balance: balance.uiAmount,
            accountInfo,
            txCount,
            latestBlock,
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch wallet stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [wallet.publicKey, isSolana]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {stats.balance.toFixed(6)} {isSolana ? "SOL" : "ETH"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.txCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Nonce</CardTitle>
          <CardDescription>Transaction count</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.accountInfo.nonce || 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Latest Block</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {stats.latestBlock.blockHeight || stats.latestBlock.number}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
