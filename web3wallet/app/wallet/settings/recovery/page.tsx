"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { onGetRecoveryPhrase } from "@/lib/wallet.manager";
import { Eye, EyeOff, Copy, DatabaseBackup } from "lucide-react";
import { toast } from "sonner";

export default function RecoverySettingsPage() {
  const [show, setShow] = useState(false);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [master, setMaster] = useState<string>("");

  const load = () => {
    const r = onGetRecoveryPhrase();
    if (r) {
      setMnemonic(r.mnemonicPhrase);
      setMaster(r.masterSeedPhrase);
      setShow(true);
      toast("Recovery phrase", { description: "Loaded successfully." });
    } else {
      toast("Not found", { description: "No recovery phrase stored." });
    }
  };

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
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <DatabaseBackup className="h-5 w-5" aria-hidden />
        <h1 className="text-xl md:text-2xl font-bold text-pretty">Recovery</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recovery Phrase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={load}>Get Recovery Keys</Button>
            <Button variant="outline" onClick={() => setShow((s) => !s)}>
              {show ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {show ? "Hide" : "Show"}
            </Button>
            <Button
              variant="outline"
              onClick={() => copy(mnemonic, "Mnemonic copied")}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Mnemonic
            </Button>
            <Button
              variant="outline"
              onClick={() => copy(master, "Master seed copied")}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Master Seed
            </Button>
          </div>

          <div className="mt-2 rounded bg-muted/60 p-3">
            {show && mnemonic ? (
              <div className="text-sm space-y-3">
                <div>
                  <div className="font-medium">Mnemonic:</div>
                  <div className="mt-1">{mnemonic}</div>
                </div>
                <div>
                  <div className="font-medium">Master Seed (hex):</div>
                  <div className="mt-1 break-all text-xs">{master}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Recovery keys are hidden.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
