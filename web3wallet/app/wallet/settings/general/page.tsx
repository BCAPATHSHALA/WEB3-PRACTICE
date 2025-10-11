"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { onClearAllWalletData, onDeleteAllWallets } from "@/lib/wallet.manager";
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
import { toast } from "sonner";
import { Cog } from "lucide-react";

const DEFAULT_KEY = "wallet-default-coin"; // "501" | "60"

export default function GeneralSettingsPage() {
  const [defaultCoin, setDefaultCoin] = useState<"501" | "60">("501");
  const [confirm, setConfirm] = useState<"delete-all" | "clear-all" | null>(
    null
  );

  useEffect(() => {
    try {
      const v = localStorage.getItem(DEFAULT_KEY) as "501" | "60" | null;
      if (v) setDefaultCoin(v);
    } catch {}
  }, []);

  const saveDefault = () => {
    try {
      localStorage.setItem(DEFAULT_KEY, defaultCoin);
      toast("Saved", {
        description: `Default coin set to ${
          defaultCoin === "501" ? "Solana" : "Ethereum"
        }.`,
      });
    } catch {
      toast("Failed", { description: "Unable to save preference." });
    }
  };

  const runConfirm = () => {
    if (confirm === "delete-all") {
      onDeleteAllWallets();
      toast("All wallets deleted");
    } else if (confirm === "clear-all") {
      onClearAllWalletData();
      toast("All data cleared");
    }
    setConfirm(null);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Cog className="h-5 w-5" aria-hidden />
        <h1 className="text-xl md:text-2xl font-bold text-pretty">General</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default Coin Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm">
              Choose which coin to use by default when creating wallets.
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={defaultCoin === "501" ? "default" : "outline"}
              onClick={() => setDefaultCoin("501")}
            >
              Solana
            </Button>
            <Button
              variant={defaultCoin === "60" ? "default" : "outline"}
              onClick={() => setDefaultCoin("60")}
            >
              Ethereum
            </Button>
          </div>
          <Button onClick={saveDefault}>Save Preference</Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setConfirm("delete-all")}>
            Delete All Wallets
          </Button>
          <Button variant="destructive" onClick={() => setConfirm("clear-all")}>
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "delete-all"
                ? "Delete all wallets?"
                : "Clear ALL wallet data?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "delete-all"
                ? "This removes every wallet from storage."
                : "This removes wallets and recovery phrase."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
