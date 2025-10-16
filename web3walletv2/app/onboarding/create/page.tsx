"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateWalletForm } from "./_components/create-wallet-form";
import { RecoveryPhraseDisplay } from "./_components/recovery-phrase-display";
import { ConfirmRecoveryPhrase } from "./_components/confirm-recovery-phrase";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Step = "generate" | "confirm" | "password";

export default function CreateWalletPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("generate");
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>("");

  const handleRecoveryGenerated = (phrase: string) => {
    setRecoveryPhrase(phrase);
    setStep("confirm");
  };

  const handleRecoveryConfirmed = () => {
    setStep("password");
  };

  const handleWalletCreated = () => {
    router.push("/wallet");
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Wallet</h1>
          <p className="text-muted-foreground">
            Follow the steps to create your secure Web3 wallet
          </p>
        </div>

        <Card className="p-6">
          <Tabs value={step} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="generate" disabled={step !== "generate"}>
                Generate
              </TabsTrigger>
              <TabsTrigger value="confirm" disabled={step !== "confirm"}>
                Confirm
              </TabsTrigger>
              <TabsTrigger value="password" disabled={step !== "password"}>
                Secure
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <CreateWalletForm onRecoveryGenerated={handleRecoveryGenerated} />
            </TabsContent>

            <TabsContent value="confirm" className="space-y-4">
              {recoveryPhrase && (
                <>
                  <RecoveryPhraseDisplay phrase={recoveryPhrase} />
                  <ConfirmRecoveryPhrase
                    phrase={recoveryPhrase}
                    onConfirmed={handleRecoveryConfirmed}
                  />
                </>
              )}
            </TabsContent>

            <TabsContent value="password" className="space-y-4">
              {recoveryPhrase && (
                <CreateWalletForm
                  recoveryPhrase={recoveryPhrase}
                  isPasswordStep
                  onWalletCreated={handleWalletCreated}
                />
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
}
