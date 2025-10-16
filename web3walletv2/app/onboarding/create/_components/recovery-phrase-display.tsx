"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface RecoveryPhraseDisplayProps {
  phrase: string;
}

export function RecoveryPhraseDisplay({ phrase }: RecoveryPhraseDisplayProps) {
  const [revealed, setRevealed] = useState(false);
  const words = phrase.split(" ");

  const handleCopy = () => {
    navigator.clipboard.writeText(phrase);
    toast.success("Recovery phrase copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          Write down these 12 words in order. Store them in a safe place. Never
          share them with anyone.
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {words.map((word, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border text-center transition-all ${
                revealed
                  ? "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  : "bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500 blur-sm"
              }`}
            >
              <span className="text-xs text-muted-foreground block mb-1">
                {index + 1}
              </span>
              <span
                className={`font-mono font-semibold ${
                  !revealed ? "text-transparent" : ""
                }`}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setRevealed(!revealed)}
            className="flex-1"
          >
            {revealed ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Reveal
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="flex-1 bg-transparent"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
      </Card>
    </div>
  );
}
