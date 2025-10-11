"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  onAddWallet,
  onDeleteWallet,
  onGetAllWallets,
  onGetWallet,
  onUpdateWallet,
} from "@/lib/wallet.manager";
import type { IWallet } from "@/types/types.wallet";
import { WalletCard } from "../_components/wallet-card";
import { FaEthereum } from "react-icons/fa";
import { toast } from "sonner";
import WalletDetailsDialog from "../_components/wallet-details-dialog";

type ConfirmType = "delete" | "update" | null;

export default function EthereumWalletsPage() {
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [confirm, setConfirm] = useState<{
    type: ConfirmType;
    accountNumber?: string;
  }>({ type: null });
  const [loading, setLoading] = useState(false);
  const [detailsWallet, setDetailsWallet] = useState<IWallet | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  const ethWallets = useMemo(
    () => wallets.filter((w) => w.coinType === "60"),
    [wallets]
  );

  const refresh = () => {
    const { allWallets } = onGetAllWallets();
    setWallets(allWallets ?? []);
  };

  const addEthereum = () => {
    setLoading(true);
    try {
      onAddWallet("60");
      refresh();
      toast("Wallet added", {
        description: "A new Ethereum wallet was created.",
      });
    } catch (e) {
      toast("Error", { description: String(e) });
    } finally {
      setLoading(false);
    }
  };

  const handleGetAWallet = (accountNumber: string) => {
    const w = onGetWallet(accountNumber, "accountNumber");
    if (w) {
      setDetailsWallet(w);
      toast("Wallet loaded", { description: "Details opened." });
    } else {
      toast("Not found", { description: "Wallet not found." });
    }
  };

  const doConfirm = () => {
    if (!confirm.type || !confirm.accountNumber) return;
    if (confirm.type === "delete") {
      onDeleteWallet(confirm.accountNumber);
      toast("Deleted", { description: "Ethereum wallet removed." });
    } else if (confirm.type === "update") {
      onUpdateWallet(confirm.accountNumber);
      toast("Updated", {
        description: "Ethereum wallet keys regenerated.",
      });
    }
    setConfirm({ type: null });
    refresh();
  };

  return (
    <section className="min-h-screen">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-pretty flex items-center gap-2">
          <FaEthereum className="h-5 w-5 text-[#627EEA]" /> Ethereum Wallets
        </h1>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <Button onClick={addEthereum} disabled={loading}>
            Add Ethereum Wallet
          </Button>
        </div>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        {ethWallets.length} wallet(s)
      </p>

      <Separator className="my-6" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ethWallets.length === 0 ? (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">
                No Ethereum wallets yet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create your first Ethereum wallet to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          ethWallets.map((w) => (
            <WalletCard
              key={w.accountNumber}
              wallet={w}
              onGet={handleGetAWallet}
              onUpdate={() =>
                setConfirm({ type: "update", accountNumber: w.accountNumber })
              }
              onDelete={() =>
                setConfirm({ type: "delete", accountNumber: w.accountNumber })
              }
              defaultMasked={true}
            />
          ))
        )}
      </div>

      {/* Alert Dialog */}
      <AlertDialog
        open={!!confirm.type}
        onOpenChange={(o) => !o && setConfirm({ type: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm.type === "delete"
                ? "Delete this wallet?"
                : "Regenerate keys for this wallet?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm.type === "delete"
                ? "This cannot be undone and will remove this wallet."
                : "This regenerates keys for the selected wallet."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Wallet Details Dialog */}
      <WalletDetailsDialog
        open={!!detailsWallet}
        wallet={detailsWallet}
        onOpenChange={(o) => !o && setDetailsWallet(null)}
      />
    </section>
  );
}
