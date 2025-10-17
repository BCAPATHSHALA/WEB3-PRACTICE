"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface ConfirmRecoveryPhraseProps {
  phrase: string;
  onConfirmed: () => void;
}

export function ConfirmRecoveryPhrase({
  phrase,
  onConfirmed,
}: ConfirmRecoveryPhraseProps) {
  const [input, setInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const words = phrase.trim().split(/\s+/);

  // Generate random words ONCE only
  const randomWordsRef = useRef<{ index: number; word: string }[]>([]);
  if (randomWordsRef.current.length === 0) {
    const indices = new Set<number>();
    while (indices.size < 2) {
      indices.add(Math.floor(Math.random() * words.length));
    }
    randomWordsRef.current = Array.from(indices).map((i) => ({
      index: i,
      word: words[i],
    }));
  }

  const randomWords = randomWordsRef.current;

  const handleVerify = () => {
    const inputWords = input.trim().toLowerCase().split(/\s+/);
    const isCorrect =
      inputWords.length === randomWords.length &&
      inputWords.every((word, i) => word === randomWords[i].word.toLowerCase());

    if (isCorrect) {
      setIsVerified(true);
      toast.success("Recovery phrase verified!");
    } else {
      toast.error("Incorrect words. Please try again.");
      setInput("");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          To confirm you've saved your recovery phrase, enter the words at
          positions{" "}
          <span className="font-semibold">
            {randomWords.map((w) => w.index + 1).join(" and ")}
          </span>
        </p>
      </Card>

      <div className="space-y-3">
        {randomWords.map((item, idx) => (
          <div key={idx}>
            <Label className="text-sm">Word #{item.index + 1}</Label>
            <Input
              type="text"
              placeholder={`Enter word #${item.index + 1}`}
              value={input.split(/\s+/)[idx] || ""}
              onChange={(e) => {
                const parts = input.split(/\s+/);
                parts[idx] = e.target.value;
                setInput(parts.join(" ").trim());
              }}
              disabled={isVerified}
              className="mt-1"
            />
          </div>
        ))}
      </div>

      {isVerified ? (
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-900 dark:text-green-100">
            Recovery phrase verified successfully!
          </p>
        </div>
      ) : null}

      <Button
        onClick={handleVerify}
        disabled={isVerified || input.split(/\s+/).length < randomWords.length}
        className="w-full"
      >
        Verify Recovery Phrase
      </Button>

      {isVerified && (
        <Button onClick={onConfirmed} className="w-full" variant="default">
          Continue to Password Setup
        </Button>
      )}
    </div>
  );
}
