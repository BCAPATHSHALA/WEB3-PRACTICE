"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useMaskSecrets } from "@/hooks/use-mask-secrets";
import { onClearAllWalletData } from "@/lib/wallet.manager";
import { Key, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
  const { masked, setMasked } = useMaskSecrets();
  const [confirm, setConfirm] = useState(false);

  const toggleMask = (next: boolean) => {
    setMasked(next);
    toast("Preference saved", {
      description: next
        ? "Secrets will be masked by default."
        : "Secrets will be visible by default.",
    });
  };

  const clearAll = () => {
    onClearAllWalletData();
    toast("All data cleared", {
      description: "Wallets and recovery phrase removed from this browser.",
    });
    setConfirm(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5" aria-hidden />
        <h1 className="text-xl md:text-2xl font-bold text-pretty">Security</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" aria-hidden />
            Secret visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm">Mask secrets by default</Label>
              <p className="text-xs text-muted-foreground mt-1">
                When enabled, private keys and sensitive values are hidden until
                you reveal them.
              </p>
            </div>
            <Switch
              checked={masked}
              onCheckedChange={toggleMask}
              aria-label="Mask secrets by default"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base">Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Permanently remove all wallets and recovery data stored in this
            browser.
          </div>
          <div className="sm:ml-auto">
            <Button variant="destructive" onClick={() => setConfirm(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear ALL data
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirm} onOpenChange={(o) => !o && setConfirm(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear ALL wallet data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove wallets and the recovery phrase from browser
              storage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearAll}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
