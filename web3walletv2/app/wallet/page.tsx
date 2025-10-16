"use client";

import { useEffect, useState } from "react";
import { useWalletStore } from "@/store/use.wallet.store";
import { onGetAllWallets } from "@/utils/wallet.flows.util";
import type { IWallet } from "@/types/types.wallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletsList } from "./_components/wallets-list";
import { AddWalletDialog } from "./_components/add-wallet-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function WalletDashboard() {
  const { wallets } = useWalletStore();
  const [solanaWallets, setSolanaWallets] = useState<IWallet[]>([]);
  const [ethereumWallets, setEthereumWallets] = useState<IWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const { solanaWallets, ethereumWallets } = await onGetAllWallets();
        setSolanaWallets(solanaWallets);
        setEthereumWallets(ethereumWallets);
      } catch (error) {
        console.error("Failed to load wallets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallets();
  }, [wallets]);

  const totalWallets = solanaWallets.length + ethereumWallets.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Wallets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your Solana and Ethereum wallets
          </p>
        </div>
        <AddWalletDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalWallets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Solana Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{solanaWallets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ethereum Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ethereumWallets.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Wallets Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Wallets</CardTitle>
          <CardDescription>View and manage all your wallets</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({totalWallets})</TabsTrigger>
              <TabsTrigger value="solana">
                Solana ({solanaWallets.length})
              </TabsTrigger>
              <TabsTrigger value="ethereum">
                Ethereum ({ethereumWallets.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="text-center py-8">Loading wallets...</div>
              ) : wallets.length === 0 ? (
                <EmptyState />
              ) : (
                <WalletsList wallets={wallets} />
              )}
            </TabsContent>

            <TabsContent value="solana" className="mt-6">
              {isLoading ? (
                <div className="text-center py-8">Loading wallets...</div>
              ) : solanaWallets.length === 0 ? (
                <EmptyState chainName="Solana" />
              ) : (
                <WalletsList wallets={solanaWallets} />
              )}
            </TabsContent>

            <TabsContent value="ethereum" className="mt-6">
              {isLoading ? (
                <div className="text-center py-8">Loading wallets...</div>
              ) : ethereumWallets.length === 0 ? (
                <EmptyState chainName="Ethereum" />
              ) : (
                <WalletsList wallets={ethereumWallets} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ chainName }: { chainName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Wallet className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-lg font-semibold mb-2">No wallets yet</h3>
      <p className="text-muted-foreground mb-6">
        {chainName
          ? `You don't have any ${chainName} wallets yet.`
          : "Create or import a wallet to get started."}
      </p>
      <AddWalletDialog />
    </div>
  );
}
