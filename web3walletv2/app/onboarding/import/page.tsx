"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  mnemonicSchema,
  type MnemonicFormData,
} from "@/lib/validations/wallet.schema";
import { importWalletWithMnemonic } from "@/utils/wallet.flows.util";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { COOKIE_KEYS } from "@/utils/constants.util";

export default function ImportWalletPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MnemonicFormData>({
    resolver: zodResolver(mnemonicSchema),
    defaultValues: {
      mnemonic: "",
      password: "",
      confirmPassword: "",
      hint: "",
    },
  });

  const onSubmit = async (data: MnemonicFormData) => {
    try {
      setIsLoading(true);
      const result = await importWalletWithMnemonic(
        data.mnemonic,
        data.password,
        data.hint
      );
      if (result.success) {
        toast.success(result.message);
        // Set cookie to mark wallet as unlocked for session persistence and vault existence check in middleware (30 days)
        document.cookie = `${COOKIE_KEYS.IS_UNLOCKED}=true; path=/; max-age=2592000`;
        document.cookie = `${COOKIE_KEYS.HAS_VAULT}=true; path=/; max-age=2592000`;
        router.push("/wallet");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to import wallet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link
          href="/onboarding"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Onboarding
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Import Wallet</h1>
          <p className="text-muted-foreground">
            Restore your wallet using your recovery phrase
          </p>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="mnemonic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recovery Phrase</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your 12 or 24-word recovery phrase"
                        className="min-h-24 font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your recovery phrase with words separated by spaces
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a strong password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Must contain uppercase, number, and special character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., My favorite color and year"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import Wallet"
                )}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </main>
  );
}
