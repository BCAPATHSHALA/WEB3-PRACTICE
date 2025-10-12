"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { onAddWallet, onGetAllWallets } from "@/lib/wallet.manager";
import type { IWallet } from "@/types/types.wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletCard } from "./_components/wallet-card1";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FaEthereum } from "react-icons/fa";
import { toast } from "sonner";
import { SiSolana } from "react-icons/si";
import { MdWallet } from "react-icons/md";

const WalletsPage: React.FC = () => {
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [solanaWallets, setSolanaWallets] = useState<IWallet[]>([]);
  const [ethereumWallets, setEthereumWallets] = useState<IWallet[]>([]);
  const [coinType, setCoinType] = useState<string>("501");
  const [loading, setLoading] = useState<boolean>(false);

  const counts = useMemo(
    () => ({
      total: wallets.length,
      sol: solanaWallets.length,
      eth: ethereumWallets.length,
    }),
    [wallets, solanaWallets, ethereumWallets]
  );

  // Load wallets once on mount
  useEffect(() => {
    refreshWallets();
  }, []);

  const refreshWallets = () => {
    const { allWallets, solanaWallets, ethereumWallets } = onGetAllWallets();
    setWallets(allWallets ?? []);
    setSolanaWallets(solanaWallets ?? []);
    setEthereumWallets(ethereumWallets ?? []);
  };

  const handleAddWallet = () => {
    try {
      setLoading(true);
      const newWallet = onAddWallet(coinType);
      refreshWallets();
      toast("Wallet added", {
        description: `A ${
          coinType === "501" ? "Solana" : "Ethereum"
        } wallet was created.`,
      });
    } catch (err) {
      toast("Error", { description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const toggleCoinType = () => {
    setCoinType((prev) => (prev === "501" ? "60" : "501"));
  };

  return (
    <TooltipProvider>
      <section className="min-h-screen">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <MdWallet className="h-8 w-8" aria-hidden />
            <h1 className="text-xl md:text-2xl font-bold text-pretty">
              {" "}
              Web3 Wallets
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Button onClick={handleAddWallet} disabled={loading}>
              Add {coinType === "501" ? <SiSolana /> : <FaEthereum />} Wallet
            </Button>
            <Button variant="secondary" onClick={toggleCoinType}>
              Switch to {coinType === "501" ? <FaEthereum /> : <SiSolana />}
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Stats Section - Responsive Modern Mini Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {/* Total Wallets */}
          <Card className="transition-all hover:shadow-md hover:scale-[1.02] duration-300">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Wallets
              </CardTitle>
              <MdWallet className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="text-3xl md:text-5xl font-bold text-center mt-2">
              {counts.total}
            </CardContent>
          </Card>

          {/* Solana */}
          <Card className="transition-all hover:shadow-md hover:scale-[1.02] duration-300">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Solana
              </CardTitle>
              <SiSolana className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="text-3xl md:text-5xl font-bold text-center mt-2">
              {counts.sol}
            </CardContent>
          </Card>

          {/* Ethereum */}
          <Card className="transition-all hover:shadow-md hover:scale-[1.02] duration-300">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ethereum
              </CardTitle>
              <FaEthereum className="h-5 w-5 text-violet-600" />
            </CardHeader>
            <CardContent className="text-3xl md:text-5xl font-bold text-center mt-2">
              {counts.eth}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* Wallet Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wallets.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">No wallets yet</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Create your first wallet to get started.
              </CardContent>
            </Card>
          ) : (
            wallets.map((w, i) => (
              <WalletCard key={w.accountNumber} wallet={w} />
            ))
          )}
        </div>
      </section>
    </TooltipProvider>
  );
};

export default WalletsPage;
