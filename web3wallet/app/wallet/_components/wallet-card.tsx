"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Copy,
  RefreshCcw,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import type { IWallet } from "@/types/types.wallet";
import { SiSolana } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { toast } from "sonner";

export type WalletCardProps = {
  wallet: IWallet;
  onGet?: (accountNumber: string) => void;
  onUpdate?: (accountNumber: string) => void;
  onDelete?: (accountNumber: string) => void;
  defaultMasked?: boolean;
};

export function WalletCard({
  wallet,
  onGet,
  onUpdate,
  onDelete,
  defaultMasked = true,
}: WalletCardProps) {
  const [masked, setMasked] = useState<boolean>(defaultMasked);

  const coin =
    wallet.coinType === "501"
      ? { label: "Solana", Icon: SiSolana, color: "text-[#14F195]" }
      : { label: "Ethereum", Icon: FaEthereum, color: "text-[#627EEA]" };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied", { description: label });
    } catch {
      toast("Copy failed", {
        description: "Unable to copy to clipboard.",
      });
    }
  };

  return (
    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <coin.Icon className={`${coin.color} h-4 w-4`} aria-hidden />
            <span className="font-medium">{coin.label} Wallet</span>
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {wallet.accountNumber.slice(0, 6)}…{wallet.accountNumber.slice(-4)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onGet?.(wallet.accountNumber)}
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Account
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onUpdate?.(wallet.accountNumber)}
          >
            <RefreshCcw className="h-3.5 w-3.5 mr-1" /> Update
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete?.(wallet.accountNumber)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs">
          <div className="font-medium">Public</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="break-all text-[12px] flex-1">
              {wallet.publicKey}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copy(wallet.publicKey, "Public key copied")}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="text-xs">
          <div className="font-medium">Private</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="break-all text-[12px] select-none flex-1">
              {masked ? "•••••••••••••••••••••" : wallet.privateKey}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setMasked((s) => !s)}
              aria-label={masked ? "Show" : "Hide"}
            >
              {masked ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copy(wallet.privateKey, "Private key copied")}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
