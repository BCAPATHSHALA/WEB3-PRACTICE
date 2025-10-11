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
import { Eye, EyeOff, Copy } from "lucide-react";
import { SiSolana } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import type { IWallet } from "@/types/types.wallet";
import { ButtonGroup } from "@/components/ui/button-group";

type WalletDetailsDialogProps = {
  open: boolean;
  wallet: IWallet | null;
  onOpenChange: (open: boolean) => void;
};

export default function WalletDetailsDialog({
  open,
  wallet,
  onOpenChange,
}: WalletDetailsDialogProps) {
  const [maskedPrivate, setMaskedPrivate] = useState(true);
  const [maskedSeed, setMaskedSeed] = useState(true);

  const copy = async (text?: string, label?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label ?? "Copied to clipboard");
    } catch {
      toast.error("Copy failed", { description: "Unable to copy text" });
    }
  };

  const getCoinBadge = () => {
    if (!wallet) return null;
    const isSol = wallet.coinType === "501";
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
          isSol
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-violet-50 border-violet-200 text-violet-700"
        }`}
      >
        {isSol ? (
          <SiSolana className="h-4 w-4" />
        ) : (
          <FaEthereum className="h-4 w-4" />
        )}
        <span>{isSol ? "Solana" : "Ethereum"}</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              {getCoinBadge()}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Review full wallet details. Keep your private information secure.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-3" />

        {wallet ? (
          <Card className="shadow-sm border rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Wallet Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Path</p>
                  <div className="bg-muted/30 rounded-md p-2 font-mono text-xs break-words">
                    {wallet.path}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Account Number
                  </p>
                  <div className="bg-muted/30 rounded-md p-2 font-mono text-xs break-words">
                    {wallet.accountNumber}
                  </div>
                </div>
              </div>

              {/* Accordion for sensitive info */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="derivedSeed">
                  <AccordionTrigger className="text-sm font-semibold">
                    Derived Seed
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="relative bg-muted/30 rounded-md p-3 font-mono text-xs break-all flex justify-between gap-2">
                      <p>
                        {maskedSeed
                          ? "••••••••••••••••••••••••••"
                          : wallet.derivedSeed}
                      </p>
                      <ButtonGroup>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setMaskedSeed((s) => !s)}
                          aria-label="Toggle derived seed visibility"
                        >
                          {maskedSeed ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            copy(wallet.derivedSeed, "Derived seed copied")
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="privateKey">
                  <AccordionTrigger className="text-sm font-semibold">
                    Private Key
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="relative bg-muted/30 rounded-md p-3 font-mono text-xs break-all flex justify-between gap-2">
                      <p>
                        {maskedPrivate
                          ? "••••••••••••••••••••••••••"
                          : wallet.privateKey}
                      </p>
                      <ButtonGroup>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setMaskedPrivate((s) => !s)}
                          aria-label="Toggle private key visibility"
                        >
                          {maskedPrivate ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            copy(wallet.privateKey, "Private key copied")
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="publicKey">
                  <AccordionTrigger className="text-sm font-semibold">
                    Public Key
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-muted/30 rounded-md p-3 font-mono text-xs break-all flex justify-between gap-2">
                      <p>{wallet.publicKey}</p>

                      <ButtonGroup>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copy(wallet.publicKey, "Public key copied")
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Footer Warning */}
              <p className="text-[11px] text-muted-foreground mt-3 italic">
                ⚠️ Never share your private key or derived seed. Anyone with
                access can control your wallet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-6">
            No wallet selected.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
