"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Copy, AlertTriangle } from "lucide-react";
import { SiSolana } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import type { IWallet } from "@/types/types.wallet";

type WalletDetailsDialogProps = {
  open: boolean;
  wallet: IWallet;
  onOpenChange: (open: boolean) => void;
};

export function WalletDetailsDialog({
  open,
  wallet,
  onOpenChange,
}: WalletDetailsDialogProps) {
  const [maskedPrivate, setMaskedPrivate] = useState(true);
  const [maskedSeed, setMaskedSeed] = useState(true);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const isSolana = wallet.coinType === "501";
  const coinLabel = isSolana ? "Solana" : "Ethereum";
  const coinIcon = isSolana ? SiSolana : FaEthereum;
  const CoinIcon = coinIcon;

  const truncateAddress = (address: string, chars = 8) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <CoinIcon
                className={`h-5 w-5 ${
                  isSolana ? "text-[#14F195]" : "text-[#627EEA]"
                }`}
              />
              {coinLabel} Wallet Details
            </DialogTitle>
          </div>
          <DialogDescription>
            Review your wallet information. Keep sensitive data secure.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Derivation Path
                </label>
                <div className="mt-1 p-2 bg-muted rounded font-mono text-xs break-all">
                  {wallet.path}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Account Number
                </label>
                <div className="mt-1 p-2 bg-muted rounded font-mono text-xs break-all">
                  {wallet.accountNumber}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Wallet Index
                </label>
                <div className="mt-1 p-2 bg-muted rounded font-mono text-xs">
                  {wallet.index}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keys Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Keys & Seeds</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="publicKey">
                  <AccordionTrigger className="text-sm font-medium">
                    Public Address
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded font-mono text-xs break-all">
                        {wallet.publicKey}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copy(wallet.publicKey, "Public address copied")
                        }
                        className="w-full"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Address
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="privateKey">
                  <AccordionTrigger className="text-sm font-medium">
                    Private Key
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded font-mono text-xs break-all">
                        {maskedPrivate
                          ? "••••••••••••••••••••••••••"
                          : wallet.privateKey}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setMaskedPrivate(!maskedPrivate)}
                          className="flex-1"
                        >
                          {maskedPrivate ? (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Reveal
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copy(wallet.privateKey, "Private key copied")
                          }
                          className="flex-1"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="derivedSeed">
                  <AccordionTrigger className="text-sm font-medium">
                    Derived Seed
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded font-mono text-xs break-all">
                        {maskedSeed
                          ? "••••••••••••••••••••••••••"
                          : wallet.derivedSeed}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setMaskedSeed(!maskedSeed)}
                          className="flex-1"
                        >
                          {maskedSeed ? (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Reveal
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copy(wallet.derivedSeed, "Derived seed copied")
                          }
                          className="flex-1"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Security Warning */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-semibold mb-1">Keep Your Keys Safe</p>
              <p className="text-xs">
                Never share your private key or seed with anyone. Anyone with
                access can control your wallet and steal your funds.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
