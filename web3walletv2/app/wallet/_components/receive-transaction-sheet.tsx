"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import type { IWallet } from "@/types/types.wallet";

interface ReceiveTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: IWallet;
}

export function ReceiveTransactionSheet({
  open,
  onOpenChange,
  wallet,
}: ReceiveTransactionSheetProps) {
  const [copied, setCopied] = useState(false);
  const isSolana = wallet.coinType === "501";

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.publicKey);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy address");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-3xl sm:max-w-[500px] px-2">
        <SheetHeader>
          <SheetTitle>Receive {isSolana ? "SOL" : "ETH"}</SheetTitle>
          <SheetDescription>
            Share your address to receive funds
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* QR Code */}
          <div className="flex justify-center p-4">
            <div id="qr-code">
              <QRCodeSVG
                value={wallet.publicKey}
                size={256}
                level="H"
                includeMargin={true}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>

          {/* Address Display */}
          <div className="w-full max-w-sm mx-auto space-y-3 text-center">
            {/* Title */}
            <h2 className="text-base font-semibold">
              {isSolana ? "Your Solana Address" : "Your Ethereum Address"}
            </h2>

            {/* Address Box */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-3">
              <p className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                {wallet.publicKey}
              </p>

              <div className="my-2 border-t border-gray-200 dark:border-gray-800" />

              <Button
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center gap-2 text-sm border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900"
                onClick={copyAddress}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>

            {/* Info Text */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isSolana
                ? "This is your Solana wallet address. Only send SOL to this address."
                : "This is your Ethereum wallet address. Only send ETH and ERC-20 tokens to this address."}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
