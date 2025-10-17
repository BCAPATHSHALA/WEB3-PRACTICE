"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Copy, ShieldCheck, ChevronRight } from "lucide-react";
import type { IWallet } from "@/types/types.wallet";
import { SiSolana } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";
import { WalletDetailsDialog } from "./wallet-details-dialog";

export type WalletCardProps = {
  wallet: IWallet;
  masked?: boolean;
};

export function WalletCard({ wallet, masked = true }: WalletCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const coin =
    wallet.coinType === "501"
      ? { label: "Solana", Icon: SiSolana, color: "text-[#14F195]" }
      : { label: "Ethereum", Icon: FaEthereum, color: "text-[#627EEA]" };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const truncateAddress = (address: string, chars = 6) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  return (
    <>
      <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-0.5 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <coin.Icon className={`${coin.color} h-5 w-5`} />
              <div>
                <CardTitle className="text-base">
                  {coin.label} Wallet {wallet.index + 1}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {truncateAddress(wallet.accountNumber)}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {coin.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Public Key Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">
              Public Address
            </label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <code className="text-xs flex-1 break-all font-mono">
                {truncateAddress(wallet.publicKey, 8)}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copy(wallet.publicKey, "Public address copied")}
                className="h-7 w-7 p-0"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Private Key Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">
              Private Key
            </label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <code className="text-xs flex-1 font-mono">
                {isRevealed
                  ? truncateAddress(wallet.privateKey, 8)
                  : "••••••••••••••••"}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsRevealed(!isRevealed)}
                className="h-7 w-7 p-0"
              >
                {isRevealed ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copy(wallet.privateKey, "Private key copied")}
                className="h-7 w-7 p-0"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => setShowDetails(true)}
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              asChild
            >
              <Link href={`/wallet/${wallet.accountNumber}`}>
                View
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <WalletDetailsDialog
        wallet={wallet}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
}
