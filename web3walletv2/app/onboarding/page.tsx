"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store/use.wallet.store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Wallet, Upload, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { unlocked } = useWalletStore();

  useEffect(() => {
    if (unlocked) {
      router.push("/wallet");
    }
  }, [unlocked, router]);

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Web3 Wallet
          </h1>
          <p className="text-lg text-muted-foreground">
            Securely manage your Solana and Ethereum wallets
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create New Wallet */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-6 w-6 text-primary" />
                <CardTitle>Create New Wallet</CardTitle>
              </div>
              <CardDescription>
                Generate a new recovery phrase and create your wallets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Start fresh with a new secure recovery phrase. You'll be able to
                create multiple wallets for different blockchains.
              </p>
              <Button asChild className="w-full">
                <Link href="/onboarding/create">
                  Create Wallet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Import Existing Wallet */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-6 w-6 text-primary" />
                <CardTitle>Import Wallet</CardTitle>
              </div>
              <CardDescription>
                Import an existing wallet using your recovery phrase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Have an existing recovery phrase? Import it here to restore your
                wallets and continue managing them.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/onboarding/import">
                  Import Wallet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Already have a wallet?{" "}
            <Link
              href="/onboarding/unlock"
              className="text-primary hover:underline"
            >
              Unlock it here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
